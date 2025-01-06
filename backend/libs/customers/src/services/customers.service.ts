import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CustomerQueryDto, CustomerTableDto } from '../dtos/list-customers.dto';
import { ExternalCustomer } from '../../../integrations/src/interfaces/external-customer.interface';

@Injectable()
export class CustomersService {
  private logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async findAll(
    queryDto: CustomerQueryDto,
  ): Promise<{ customers: CustomerTableDto[]; total: number }> {
    this.logger.log(`Find customers`);
    try {
      const {
        search,
        orderBy = 'createdAt',
        order = 'DESC',
        page = 1,
        limit = 10,
      } = queryDto;
      const query = this.customerRepository
        .createQueryBuilder('c')
        .leftJoin('c.orders', 'o')
        .leftJoin('c.chats', 'ch')
        .leftJoin('c.shoppingCarts', 'sh')
        .select([
          'c.id',
          'c.name',
          'c.mobile',
          'c.contactFirstName',
          'c.contactLastName',
          'c.email',
          'c.address',
          'c.businessName',
          'c.purchaseFrequency',
          'c.purchaseFrequencyDay',
          'c.lastPurchaseAt',
          'c.status',
          'c.createdAt',
        ])
        .addSelect('SUM(o.total)', 'totalSpent');

      if (search) {
        query.andWhere(
          'c.name ILIKE :search OR c.contact_first_name ILIKE :search OR c.contact_last_name ILIKE :search OR c.email ILIKE :search OR c.externalId ILIKE :search ',
          {
            search: `%${search}%`,
          },
        );
      }
      if (orderBy) {
        query.orderBy(`c.${orderBy}`, order || 'ASC');
      }
      query.groupBy('c.id');

      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
      const [customers, total] = await query.getManyAndCount();

      const customerIds = customers.map((c) => c.id) || [];
      let lastOrderMap: any;
      if (customerIds?.length > 0) {
        const lastOrdersQuery = this.customerRepository.manager
          .createQueryBuilder()
          .select('o.customerId', 'customerId')
          .addSelect('o.id', 'orderId')
          .addSelect('o.orderDate', 'orderDate')
          .from('order', 'o')
          .where('o.customerId IN (:...customerIds)', {
            customerIds: customerIds || [''],
          })
          .orderBy('o.customerId')
          .addOrderBy('o.orderDate', 'DESC');

        const lastOrders = await lastOrdersQuery.getRawMany();
        lastOrderMap = new Map(
          lastOrders.map((o) => [o.customerId, o.orderId]),
        );
      }
      const customerTableDtos: CustomerTableDto[] = customers.map(
        (row: any) => {
          return {
            ...row,
            lastOrderId: lastOrderMap?.get(row.id) || null,
            fullContactName: [row.contactFirstName, row.contactLastName]
              .join(' ')
              .trim(),
            totalSpent: Number(row.totalSpent) || 0,
          };
        },
      );

      return { customers: customerTableDtos, total };
    } catch (error) {
      this.logger.error(`Failed to get data`, error);
      throw error;
    }
  }

  async findOne(id: string): Promise<CustomerEntity> {
    this.logger.log(`Find customer - ${id}`);
    return await this.customerRepository.findOneOrFail({
      where: { id },
    });
  }

  async findOneWithOrders(id: string): Promise<CustomerEntity> {
    this.logger.log(`Find customer with orders - ${id}`);
    return await this.customerRepository.findOneOrFail({
      where: { id },
      relations: ['orders'],
    });
  }

  async findOneByExternalId(externalId: string) {
    this.logger.log(`Find customer by external id - ${externalId}`);
    return await this.customerRepository.findOne({
      where: { externalId },
    });
  }

  async findOneByExternalIdAndChannel(
    externalId: string,
    externalSource: string,
  ) {
    this.logger.log(`Find customer by external id - ${externalId}`);
    return await this.customerRepository.findOne({
      where: { externalId, externalSource },
    });
  }

  async update(id: string, updateCustomerDto: any): Promise<CustomerEntity> {
    this.logger.log(`Update customer - ${id}`);
    await this.customerRepository.update(id, updateCustomerDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.customerRepository.delete(id);
  }

  async getCustomerStrategy(customerId: string) {
    try {
      const customer = await this.findOne(customerId);
      const strategy =
        (customer.isCurrentCustomer && 'PRESENTE') ||
        (customer.isPastCustomer ? 'PASADO' : 'FUTURO');
      return strategy;
    } catch (err) {
      return 'N/A';
    }
  }

  async upsertExternalClient(dto: ExternalCustomer): Promise<void> {
    try {
      const { id, ...rest } = dto;
      const existingClient = await this.customerRepository.findOne({
        where: { externalId: id },
      });
      if (existingClient) {
        Object.assign(existingClient, {
          ...rest,
          externalSource: rest.source,
        });
        await this.customerRepository.save(existingClient);
      } else {
        const newCustomer = this.customerRepository.create();
        Object.assign(newCustomer, {
          ...rest,
          externalId: id,
          externalSource: rest.source,
        });
        await this.customerRepository.save(newCustomer);
      }
    } catch (error) {
      this.logger.error(`Error updating customer`, error);
    }
  }
}
