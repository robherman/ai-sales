import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Or } from 'typeorm';
import { ProductNoOrderEntity } from '../entities/product-no-order.entity';
import { ExternalCustomerNonOrderProduct } from '../../../integrations/src/interfaces/external-customer-non-ordered-product.interface';

@Injectable()
export class ProductsNoOrderService {
  constructor(
    @InjectRepository(ProductNoOrderEntity)
    private productNoOrderRepository: Repository<ProductNoOrderEntity>,
  ) {}

  async findAll({
    customerId,
    sku,
    search,
  }: {
    customerId?: string;
    sku?: string;
    search?: string;
  }): Promise<ProductNoOrderEntity[]> {
    try {
      const qb = this.productNoOrderRepository.createQueryBuilder('p');
      qb.select().leftJoin('product', 'prod', 'p.sku = prod.sku');
      qb.where(
        `(p.customer_id = :cId) OR (p.sku =:sku) OR (
        prod.name ilike :input 
       or prod.common_name ilike :input 
       or prod.short_name ilike :input 
       or prod.category ilike :input 
       or prod.subcategory ilike :input 
       or prod.sku ilike :input
       or prod.externalId ilike :input) `,
        { input: `%${search}%`, cId: customerId, sku: sku },
      );
      const result = await qb.getMany();
      return result;
    } catch (err) {
      console.error('failed to get data', err);
      throw new Error(`Fetch failed`);
    }
  }

  async findAllByCustomer(customerId: string): Promise<ProductNoOrderEntity[]> {
    return await this.productNoOrderRepository.find({
      where: { customerId },
      order: { createdAt: 'desc' },
    });
  }

  async findAllBySku(sku: string): Promise<ProductNoOrderEntity[]> {
    return await this.productNoOrderRepository.find({
      where: { sku },
      order: { createdAt: 'desc' },
    });
  }

  async remove(id: string): Promise<void> {
    await this.productNoOrderRepository.delete(id);
  }

  async upsertProduct(
    dto: ExternalCustomerNonOrderProduct,
    customerId?: string,
  ): Promise<void> {
    try {
      const exists = await this.productNoOrderRepository.findOne({
        where: { sku: dto.productSku, customerId: customerId },
      });
      if (exists) {
        Object.assign(exists, {
          lastOrdered: dto.lastOrderDate,
        });
        await this.productNoOrderRepository.save(exists);
      } else {
        const newProduct = this.productNoOrderRepository.create();
        Object.assign(newProduct, {
          productId: dto.productId,
          sku: dto.productSku,
          name: dto.productName,
          customerId: customerId,
          lastOrdered: dto.lastOrderDate,
        });
        await this.productNoOrderRepository.save(newProduct);
      }
    } catch (error) {
      console.error(`Failed to update product`, error);
    }
  }
}
