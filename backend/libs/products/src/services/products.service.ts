import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { ProductQueryDto } from '../dtos/list-products.dto';
import { ExternalProduct } from '../../../integrations/src/interfaces/external-product.interface';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: any): Promise<ProductEntity> {
    const product = this.productRepository.create();
    return await this.productRepository.save(product);
  }

  async findAll(
    queryDto: ProductQueryDto,
  ): Promise<{ products: any[]; total: number }> {
    this.logger.log(`Find products `, { ...queryDto });
    try {
      const {
        search,
        orderBy = 'createdAt',
        order = 'DESC',
        page = 1,
        limit = 10,
      } = queryDto;
      const query = this.productRepository.createQueryBuilder('p');

      if (search) {
        query.andWhere(
          'p.name ILIKE :search OR p.sku ILIKE :search OR p.externalId ILIKE :search ',
          {
            search: `%${search}%`,
          },
        );
      }
      if (orderBy) {
        query.orderBy(`p.${orderBy}`, order || 'ASC');
      }

      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
      const [products, total] = await query.getManyAndCount();

      return { products, total };
    } catch (error) {
      this.logger.error(`Failed to get data`, error);
      throw error;
    }
  }

  async search(
    input: string,
    limit = 50,
    offset = 0,
  ): Promise<ProductEntity[]> {
    const qb = this.productRepository.createQueryBuilder('p');

    qb.where(
      `p.name ilike :input 
      or p.common_name ilike :input 
      or p.short_name ilike :input 
      or p.category ilike :input 
      or p.subcategory ilike :input 
      or p.sku ilike :input
      or p.externalId ilike :input`,
      { input: `%${input}%` },
    );
    qb.take(limit);
    const result = await qb.getMany();
    return result;
  }

  async ftSearch(input: string, limit = 50): Promise<ProductEntity[]> {
    const qb = this.productRepository.createQueryBuilder('p');

    qb.where(
      `to_tsvector('spanish', p.name || ' ' || p.common_name || ' ' || p.short_name || ' ' || p.category || ' ' || p.subcategory || ' ' || p.sku || ' ' || p.externalId) @@ plainto_tsquery('spanish', :input)`,
      { input },
    );
    qb.orderBy(
      "ts_rank(to_tsvector('spanish', p.name || ' ' || p.common_name || ' ' || p.short_name || ' ' || p.category || ' ' || p.subcategory || ' ' || p.sku || ' ' || p.externalId), plainto_tsquery('spanish', :input))",
      'DESC',
    );
    qb.take(limit);
    return qb.getMany();
  }

  async findAllByIdsOrSkus(values: string[]): Promise<ProductEntity[]> {
    this.logger.log(`Find products By Id/SKU`, { values });
    const qb = this.productRepository.createQueryBuilder('p');
    qb.where(`(p.id::text IN (:...values)) OR (p.sku IN (:...values))`, {
      values,
    });
    const result = await qb.getMany();
    return result;
  }

  async findAllByIds(ids: string[]): Promise<ProductEntity[]> {
    return await this.productRepository.find({ where: { id: In(ids) } });
  }

  async findAllBySku(sku: string): Promise<ProductEntity[]> {
    return await this.productRepository.find({ where: { sku } });
  }

  async findOne(id: string): Promise<ProductEntity> {
    return await this.productRepository.findOneOrFail({ where: { id } });
  }

  async findOneByExternalId(externalId: string): Promise<ProductEntity | null> {
    return await this.productRepository.findOne({
      where: { externalId },
    });
  }
  async findOneBySku(sku: string): Promise<ProductEntity | null> {
    return await this.productRepository.findOne({
      where: { sku },
    });
  }

  async findRecommendations(productIds: string[], limit: number) {
    const recommendations = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id IN (:...productIds)', { productIds })
      .orderBy('ARRAY_POSITION(:productIds, product.id)', 'ASC')
      .setParameter('productIds', productIds)
      .take(limit)
      .getMany();

    if (recommendations.length < limit) {
      const additionalProducts = await this.productRepository
        .createQueryBuilder('product')
        .where('product.id NOT IN (:...productIds)', { productIds })
        .orderBy('RANDOM()')
        .take(limit - recommendations.length)
        .getMany();

      recommendations.push(...additionalProducts);
    }

    return recommendations;
  }

  async update(id: string, updateProductDto: any): Promise<ProductEntity> {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  // async findByCategory(categoryId: string): Promise<ProductEntity[]> {
  //   return await this.productRepository.find({
  //     where: { category: { id: categoryId } },
  //   });
  // }

  async updateStock(id: string, quantity: number): Promise<ProductEntity> {
    const product = await this.findOne(id);
    product.stock += quantity;
    return await this.productRepository.save(product);
  }

  async upsertProduct(externalProduct: ExternalProduct): Promise<void> {
    try {
      const existingProduct = await this.productRepository.findOne({
        where: { externalId: externalProduct.id },
      });
      if (existingProduct) {
        Object.assign(existingProduct, {
          name: externalProduct.name,
          price: externalProduct.price,
          category: externalProduct.category,
          subcategory: externalProduct.subcategory,
          slug: externalProduct.name.toLowerCase().trim().replace(' ', '-'),
          sku: externalProduct.code,
          description: `Subcategoria: ${externalProduct.subcategory}\n\nFamilia: ${externalProduct.family3}\n\n`,
          shortName: externalProduct.shortName,
          commonName: externalProduct.commonName,
          unitLabel: externalProduct.unitLabel,
          packageUnit: externalProduct.packageUnit,
          packageUnitPrice: externalProduct.packageUnitPrice,
          packageLabel: externalProduct.packageLabel,
        });
        await this.productRepository.save(existingProduct);
      } else {
        const newProduct = this.productRepository.create();
        Object.assign(newProduct, {
          externalId: externalProduct.id,
          name: externalProduct.name,
          shortName: externalProduct.shortName,
          commonName: externalProduct.commonName,
          slug: externalProduct.name.toLowerCase().trim().replace(' ', '-'),
          sku: externalProduct.code,
          category: externalProduct.category,
          subcategory: externalProduct.subcategory,
          description: `Subcategoria: ${externalProduct.subcategory}\n\nFamilia: ${externalProduct.family3}\n\n`,
          price: externalProduct.price,
          unitLabel: externalProduct.unitLabel,
          packageUnit: externalProduct.packageUnit,
          packageUnitPrice: externalProduct.packageUnitPrice,
          packageLabel: externalProduct.packageLabel,
        });
        await this.productRepository.save(newProduct);
      }
    } catch (error) {
      this.logger.error(`Failed to update product`, error);
    }
  }
}
