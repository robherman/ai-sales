import { Injectable, Logger } from '@nestjs/common';
import { ShoppingCartWooCommerceService } from './shopping-cart-woo-commerce.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCartItemEntity } from '../entities/shopping-cart-item.entity';
import { ShoppingCartEntity } from '../entities/shopping-cart.entity';
import { ProductsService } from '../../../products/src';
import { ProductEntity } from '../../../products/src/entities/product.entity';

@Injectable()
export class ShoppingCartService {
  private logger = new Logger(ShoppingCartService.name);

  constructor(
    @InjectRepository(ShoppingCartEntity)
    private readonly cartRepository: Repository<ShoppingCartEntity>,
    @InjectRepository(ShoppingCartItemEntity)
    private readonly cartItemRepository: Repository<ShoppingCartItemEntity>,
    private wooCommerce: ShoppingCartWooCommerceService,
    private productService: ProductsService,
  ) {}

  async findOrCreateCart(
    chatId: string,
    customerId: string,
  ): Promise<ShoppingCartEntity> {
    this.logger.debug(`Find or create Cart `, { chatId, customerId });
    let cart = await this.cartRepository.findOne({
      where: { chatId, customerId, status: 'active' },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        chatId,
        customerId,
        status: 'active',
        items: [],
      });
      await this.cartRepository.save(cart);
    }

    return (await this.findCartById(cart.id))!;
  }

  async findCartById(id: string): Promise<ShoppingCartEntity | null> {
    this.logger.debug(`Find cart by id `, { id });
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    return cart;
  }

  async addItem(
    cartId: string,
    productSku: string,
    quantity: number,
  ): Promise<ShoppingCartEntity> {
    const cart = await this.findCartById(cartId);
    if (!cart) {
      throw new Error(`Invalid cart`);
    }
    const existingItem = cart.items.find((item) => item.sku === productSku);

    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const newItem = this.cartItemRepository.create({
        shoppingCart: cart,
        sku: productSku,
        quantity,
        // Add other necessary fields
      });
      cart.items.push(newItem);
    }

    await this.updateCartTotals(cart);
    return this.cartRepository.save(cart);
  }

  async repeatFromLastOrder(
    cartId: string,
    items: {
      sku: string;
      quantity?: number;
      name?: string;
      category?: string;
      subcategory?: string;
      price?: number;
      packageQuantity?: number;
      unitLabel?: string;
      packageLabel?: string;
      packageUnitPrice?: number;
    }[],
  ): Promise<ShoppingCartEntity> {
    try {
      this.logger.debug(`Repeat cart from order`, { cartId });
      let cart = await this.findCartById(cartId);
      if (!cart) {
        throw new Error(`Invalid cart`);
      }

      const skuMap = new Map(items.map((item) => [item.sku, item]));

      const updateAndRemoveItems = await Promise.all(
        cart.items.map(async (item) => {
          if (skuMap.has(item.sku)) {
            const newItem = skuMap.get(item.sku);
            const product = await this.productService.findOneBySku(item.sku);
            if (!product) {
              throw new Error(`Product with SKU ${item.sku} not found`);
            }

            item.packageQuantity = newItem?.packageQuantity || 1;
            item.quantity = item.packageQuantity * product.packageUnit;
            item.name = product.name;
            item.price = product.price || 0;
            item.unitLabel = product.unitLabel;
            item.packageLabel = product.packageLabel;
            item.packageUnitPrice = product.packageUnitPrice;
            item.productId = product.id;
            item.category = product.category;
            item.subcategory = product.subcategory;

            skuMap.delete(item.sku);
            return item;
          }
          return null;
        }),
      );

      cart.items = updateAndRemoveItems.filter((item) => item !== null);
      for (const [sku, newItem] of skuMap) {
        const product = await this.productService.findOneBySku(sku);
        if (!product) {
          throw new Error(`Product with SKU ${sku} not found`);
        }
        const item = this.cartItemRepository.create({
          shoppingCart: cart,
          quantity: (newItem.packageQuantity || 1) * product.packageUnit,
          sku: sku,
          name: product.name,
          category: product.category,
          subcategory: product.subcategory,
          price: product.price,
          packageQuantity: newItem.packageQuantity || 1,
          unitLabel: product.unitLabel,
          packageLabel: product.packageLabel,
          packageUnitPrice: product.packageUnitPrice,
          productId: product.id,
        });

        cart.items.push(item);
      }

      await this.updateCartTotals(cart);
      await this.cartRepository.save(cart);
      cart = await this.findCartById(cartId);
      return this.generateCheckoutUrl(cart!);
    } catch (error) {
      this.logger.error(`failed updating cart`, error);
      throw new Error('Failed to update cart');
    }
  }

  async updateCart(
    cartId: string,
    item: {
      sku: string;
      packageQuantity?: number;
      action: 'add' | 'update' | 'delete';
    },
  ): Promise<ShoppingCartEntity> {
    try {
      this.logger.debug(`Updating cart`, { item });
      let cart = await this.findCartById(cartId);
      if (!cart) {
        throw new Error(`Invalid cart`);
      }

      const product = await this.productService.findOneBySku(item.sku);
      if (!product) {
        throw new Error(`Product with SKU ${item.sku} not found`);
      }

      switch (item.action) {
        case 'add':
          await this.addItemToCart(cart, product, item.packageQuantity);
          break;
        case 'update':
          await this.updateItemInCart(cart, product, item.packageQuantity || 1);
          break;
        case 'delete':
          await this.deleteItemFromCart(cart, item.sku);
          break;
        default:
          throw new Error(`Invalid action: ${item.action}`);
      }

      await this.updateCartTotals(cart);
      cart = await this.cartRepository.save(cart);

      return this.generateCheckoutUrl(cart);
    } catch (error) {
      this.logger.error(`Failed updating cart`, error);
      throw new Error('Failed to update cart');
    }
  }

  private async addItemToCart(
    cart: ShoppingCartEntity,
    product: ProductEntity,
    packageQuantity: number = 1,
  ): Promise<void> {
    const existingItem = cart.items.find((item) => item.sku === product.sku);
    if (existingItem) {
      if (!existingItem.packageQuantity) {
        existingItem.packageQuantity = 0;
      }
      existingItem.packageQuantity += packageQuantity;
      existingItem.quantity =
        existingItem.packageQuantity * product.packageUnit;
    } else {
      const newItem = this.cartItemRepository.create({
        shoppingCart: cart,
        quantity: packageQuantity * product.packageUnit,
        sku: product.sku,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        packageQuantity: packageQuantity,
        unitLabel: product.unitLabel,
        packageLabel: product.packageLabel,
        packageUnitPrice: product.packageUnitPrice,
        productId: product.id,
      });
      cart.items.push(newItem);
    }
  }

  private async updateItemInCart(
    cart: ShoppingCartEntity,
    product: ProductEntity,
    packageQuantity: number,
  ): Promise<void> {
    const existingItem = cart.items.find((item) => item.sku === product.sku);
    if (!existingItem) {
      throw new Error(`Item with SKU ${product.sku} not found in cart`);
    }
    existingItem.packageQuantity = packageQuantity;
    existingItem.quantity = packageQuantity * product.packageUnit;
    existingItem.name = product.name;
    existingItem.price = product.price;
    existingItem.unitLabel = product.unitLabel;
    existingItem.packageLabel = product.packageLabel;
    existingItem.packageUnitPrice = product.packageUnitPrice;
    existingItem.category = product.category;
    existingItem.subcategory = product.subcategory;
  }

  private async deleteItemFromCart(
    cart: ShoppingCartEntity,
    sku: string,
  ): Promise<void> {
    cart.items = cart.items.filter((item) => item.sku !== sku);
  }

  async applyDiscount(
    cartId: string,
    discountAmount: number,
  ): Promise<ShoppingCartEntity> {
    this.logger.log(`Apply discount to cart `, { cartId, discountAmount });
    const cart = await this.findCartById(cartId);
    if (!cart) {
      throw new Error(`Invalid cart`);
    }
    cart.discountAmount = discountAmount;
    await this.updateCartTotals(cart);
    await this.cartRepository.save(cart);

    return this.generateCheckoutUrl(cart);
  }

  async confirmCart(cartId: string): Promise<ShoppingCartEntity> {
    this.logger.debug(`Confirm cart `, { cartId });
    let cart = await this.findCartById(cartId);
    if (!cart) {
      throw new Error(`Invalid cart`);
    }
    cart.status = 'confirmed';
    cart = await this.cartRepository.save(cart);

    return this.generateCheckoutUrl(cart);
  }

  async clearCart(cartId: string): Promise<ShoppingCartEntity> {
    this.logger.debug(`Clear cart `, { cartId });
    const cart = await this.findCartById(cartId);
    if (!cart) {
      throw new Error(`Invalid cart`);
    }
    cart.items = [];
    await this.updateCartTotals(cart);
    return this.cartRepository.save(cart);
  }

  private async updateCartTotals(cart: ShoppingCartEntity): Promise<void> {
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.Total, 0);
    cart.total =
      cart.subtotal +
      (cart.tax || 0) -
      (cart.discountAmount || 0) +
      (cart.shippingAmount || 0);
  }

  private async generateCheckoutUrl(
    cart: ShoppingCartEntity,
  ): Promise<ShoppingCartEntity> {
    try {
      const products = cart.items.map((item) => ({
        itemCode: item.sku,
        salPackUnQuantity: item.packageQuantity || 1,
      }));
      this.logger.debug(`Generate WooCommerce URL`, {
        cartId: cart.id,
        products,
      });
      const checkoutUrl = await this.wooCommerce.buildCartUrl({ products });
      if (!checkoutUrl?.success) {
        throw new Error(`Failed to generate cart url: ${checkoutUrl?.error}`);
      }
      cart.wooCommerceCheckoutUrl = checkoutUrl?.data?.cartUrl;
      await this.cartRepository.save(cart);

      cart = (await this.findCartById(cart.id))!;
      return cart;
    } catch (error) {
      this.logger.error(
        `Failed to generate checkout URL for cart ${cart.id}`,
        error.stack,
      );
      throw error;
    }
  }
}
