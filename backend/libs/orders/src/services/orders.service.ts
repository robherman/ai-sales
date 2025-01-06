import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { ProductsService } from '../../../products/src';
import { CustomersService } from '../../../customers/src';
import { OrderItemEntity } from '../entities/order-item.entity';
import { ExternalLastOrder } from '../../../integrations/src/interfaces/external-last-order.interface';
import { AddOrderItemDto } from '../dtos/add-order-item.dto';

@Injectable()
export class OrdersService {
  private logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
    private productService: ProductsService,
    private customerService: CustomersService,
  ) {}

  async create(createOrderDto: any): Promise<OrderEntity> {
    const order = this.orderRepository.create();
    return await this.orderRepository.save(order);
  }

  async findAll(queryDto: any): Promise<{ orders: any[]; total: number }> {
    try {
      const {
        search,
        orderBy = 'createdAt',
        order = 'DESC',
        page = 1,
        limit = 10,
      } = queryDto;
      const query = this.orderRepository
        .createQueryBuilder('o')
        .leftJoinAndSelect('o.items', 'oi')
        .leftJoinAndSelect('o.customer', 'oc');

      if (search) {
        query.andWhere(
          `CAST(o.orderNumber AS VARCHAR) LIKE :search OR CAST(o.customerId AS VARCHAR) ILIKE :search`,
          {
            search: `%${search}%`,
          },
        );
      }
      if (orderBy) {
        query.orderBy(`o.${orderBy}`, order || 'ASC');
      }

      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);

      const [orders, total] = await query.getManyAndCount();

      return { orders, total };
    } catch (error) {
      this.logger.error(`Failed to get data`, error);
      throw error;
    }
  }

  async findOne(id: string): Promise<OrderEntity> {
    return await this.orderRepository.findOneOrFail({
      where: { id },
      relations: ['items', 'customer'],
    });
  }

  async update(id: string, updateOrderDto: any): Promise<OrderEntity> {
    await this.orderRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async findByCustomer(
    customerId: string,
    filter?: any,
    limit = 50,
    offset = 0,
  ): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      where: { customerId },
      relations: ['items'],
      skip: offset,
      take: limit,
      order: { orderDate: 'DESC' },
    });
  }

  async findLastByCustomer(customerId: string): Promise<OrderEntity | null> {
    return await this.orderRepository.findOne({
      where: { customerId },
      order: { createdAt: 'desc' },
      relations: ['items'],
    });
  }

  async getLastCustomerOrderWithItems(
    customerId: string,
  ): Promise<OrderEntity | null> {
    try {
      const order = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.items', 'items')
        .leftJoinAndSelect('items.product', 'product')
        .where('order.customerId = :customerId', { customerId })
        .andWhere('items.id IS NOT NULL')
        .orderBy('order.orderDate', 'DESC')
        .take(1)
        .getOne();

      return order;
    } catch (error) {
      this.logger.error(
        `Error retrieving last order with items: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to retrieve last customer orders with items');
    }
  }

  async getLastCustomerOrdersWithItems(
    customerId: string,
    limit: number = 5,
  ): Promise<OrderEntity[]> {
    try {
      const orders = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.items', 'items')
        .leftJoinAndSelect('items.product', 'product')
        .where('order.customerId = :customerId', { customerId })
        .andWhere('items.id IS NOT NULL')
        .orderBy('order.orderDate', 'DESC')
        .take(limit)
        .getMany();

      return orders;
    } catch (error) {
      this.logger.error(
        `Error retrieving last customer orders with items: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to retrieve last customer orders with items');
    }
  }

  async updateStatus(id: string, status: string): Promise<OrderEntity> {
    const order = await this.findOne(id);
    order.status = status;
    return await this.orderRepository.save(order);
  }

  async calculateTotalAmount(id: string): Promise<number> {
    const order = await this.findOne(id);
    return order.items.reduce((total, product) => total + product.price, 0);
  }

  async upsertOrder(dto: ExternalLastOrder): Promise<OrderEntity | null> {
    try {
      const existing = await this.orderRepository.findOne({
        where: { externalId: dto.id },
      });
      if (!existing) {
        const newOrder = this.orderRepository.create();
        const customer = await this.customerService.findOneByExternalId(
          dto.customerId,
        );
        Object.assign(newOrder, {
          orderDate: dto.orderDate,
          orderNumber: dto.orderNumber,
          status: 'imported',
          customerId: customer?.id,
          customerName: customer?.name,
          customerEmail: customer?.email,
          customerPhone: customer?.mobile,
          billingAddress: customer?.billingAddress,
          shippingAddress: customer?.shippingAddress,
          subtotal: dto.orderTotal || 0,
          total: dto.orderTotal || 0,
          externalId: dto.id,
        });
        newOrder.items = [];
        await this.orderRepository.save(newOrder);
        return newOrder;
      }
      existing.orderDate = dto.orderDate;
      existing.orderNumber = dto.orderNumber;
      existing.total = dto.orderTotal || 0;
      return await this.orderRepository.save(existing);
    } catch (error) {
      this.logger.error(`Upsert order failed`, error);
      throw new Error('Error upserting order');
    }
  }

  async addOrderItem(dto: AddOrderItemDto) {
    const { externalId, sku, name, quantity, orderId } = dto;

    try {
      const product = await this.productService.findOneByExternalId(externalId);
      if (!product) {
        throw new Error(`Product with externalId ${externalId} not found`);
      }

      let orderItem = await this.orderItemRepository.findOne({
        where: {
          orderId,
          productId: product.id,
        },
      });

      if (!orderItem) {
        orderItem = this.orderItemRepository.create();
        orderItem.orderId = orderId;
      }

      orderItem.sku = sku || product.sku || '-';
      orderItem.name = name || product.name || '-';
      orderItem.quantity = (orderItem.quantity || 0) + (quantity || 1);
      orderItem.price = product.price || 0;
      orderItem.packageQuantity =
        orderItem.quantity / (product.packageUnit || 1);
      orderItem.unitLabel = product.unitLabel;
      orderItem.packageLabel = product.packageLabel;
      orderItem.packageUnitPrice = product.packageUnitPrice;
      orderItem.productId = product.id;

      const savedItem = await this.orderItemRepository.save(orderItem);
      return savedItem;
    } catch (error) {
      this.logger.error(
        `Error adding order item: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
