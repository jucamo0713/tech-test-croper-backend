import { Inject, Injectable } from '@nestjs/common';
import { Model, QueryFilter } from 'mongoose';
import {
  LimitValueObject,
  PageValueObject,
  Pagination,
} from '@shared/domain/models';
import {
  CurrencyConstants,
  LangIsoCodeConstants,
} from '@shared/domain/models/constants';
import { MongoAggregationUtils } from '@shared/infrastructure/driven-adapters/database';
import type { PaginatedAggregationResult } from '@shared/infrastructure/driven-adapters/database/types/paginated-aggregation-result.type';
import {
  ProductPaginationCriteria,
  ProductPaginationFilters,
  ProductRepositoryGateway,
} from '@products/domain/models/gateways';
import { Product } from '@products/domain/models/entities';
import { DatabaseProductConfigConstants } from '@products/infrastructure/database';
import { ProductDto } from '@products/infrastructure/dtos';
import { ProductDtoMapper } from '@products/infrastructure/mappers';

type ProductPersistenceFilter = QueryFilter<ProductDto>;
type ProductSort = Record<string, 1 | -1>;

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryGateway {
  constructor(
    @Inject(DatabaseProductConfigConstants.PRODUCT_DOCUMENT)
    private readonly productModel: Model<ProductDto>,
  ) {}

  async create(product: Product): Promise<Product> {
    const createdProduct = await this.productModel.create(
      ProductDtoMapper.toPersistence(product),
    );

    return ProductDtoMapper.toDomain(createdProduct.toObject<ProductDto>());
  }

  async findById(productId: string): Promise<Product | null> {
    const product = await this.productModel
      .findOne({ productId })
      .lean<ProductDto>()
      .exec();

    return product ? ProductDtoMapper.toDomain(product) : null;
  }

  async findPaginated(
    criteria: ProductPaginationCriteria,
  ): Promise<Pagination<Product>> {
    const page = criteria.page ?? 1;
    const limit = Math.min(criteria.limit ?? 10, 100);
    const filter = this.buildFilter(criteria.filters ?? {});
    const sort = this.buildSort(criteria.sortBy, criteria.sortOrder);
    const pipeline = MongoAggregationUtils.buildPaginationPipeline<ProductDto>(
      new PageValueObject(page),
      new LimitValueObject(limit),
      {
        filter,
        sort,
      },
    );
    const aggregation = (await this.productModel
      .aggregate(pipeline)
      .exec()) as PaginatedAggregationResult<ProductDto>;
    const aggregationItem = aggregation[0];
    const total = aggregationItem?.total?.total ?? 0;
    const items = aggregationItem?.data ?? [];

    return new Pagination(
      items.map((item) => ProductDtoMapper.toDomain(item)),
      page,
      limit,
      total,
    );
  }

  async update(productId: string, product: Product): Promise<Product | null> {
    const persistence = ProductDtoMapper.toPersistence(product);
    const update: Omit<ProductDto, 'productId'> = {
      name: persistence.name,
      description: persistence.description,
      prices: persistence.prices,
      status: persistence.status,
    };
    const updatedProduct = await this.productModel
      .findOneAndUpdate({ productId }, { $set: update }, { new: true })
      .lean<ProductDto>()
      .exec();

    return updatedProduct ? ProductDtoMapper.toDomain(updatedProduct) : null;
  }

  async delete(productId: string): Promise<boolean> {
    const result = await this.productModel.deleteOne({ productId }).exec();

    return result.deletedCount > 0;
  }

  private buildFilter(
    filters: ProductPaginationFilters,
  ): ProductPersistenceFilter {
    const conditions: ProductPersistenceFilter[] = [];
    const filter: ProductPersistenceFilter = {};

    if (filters.status) {
      filter.status = filters.status;
    }

    if (filters.search) {
      const searchRegex = new RegExp(this.escapeRegex(filters.search), 'i');
      conditions.push({
        $or: this.translatableSearchFields().map((field) => ({
          [field]: searchRegex,
        })),
      });
    }

    const priceFilter = this.buildPriceFilter(filters);
    if (priceFilter) {
      conditions.push(priceFilter);
    }

    const createdAtFilter = this.buildDateRangeFilter(
      filters.createdFrom,
      filters.createdTo,
    );
    if (createdAtFilter) {
      filter.createdAt = createdAtFilter;
    }

    const updatedAtFilter = this.buildDateRangeFilter(
      filters.updatedFrom,
      filters.updatedTo,
    );
    if (updatedAtFilter) {
      filter.updatedAt = updatedAtFilter;
    }

    if (conditions.length > 0) {
      filter.$and = conditions;
    }

    return filter;
  }

  private buildPriceFilter(
    filters: ProductPaginationFilters,
  ): ProductPersistenceFilter | undefined {
    if (
      filters.currency === undefined &&
      filters.minPrice === undefined &&
      filters.maxPrice === undefined
    ) {
      return undefined;
    }

    const currencies = filters.currency
      ? [filters.currency]
      : Object.values(CurrencyConstants);
    const range = this.buildNumberRangeFilter(
      filters.minPrice,
      filters.maxPrice,
    );

    return {
      $or: currencies.map((currency) => ({
        [`prices.${currency}`]:
          Object.keys(range).length > 0 ? range : { $exists: true },
      })),
    };
  }

  private buildDateRangeFilter(
    from?: Date,
    to?: Date,
  ): ProductPersistenceFilter | undefined {
    const range: ProductPersistenceFilter = {};

    if (from) {
      range.$gte = from;
    }

    if (to) {
      range.$lte = to;
    }

    return Object.keys(range).length > 0 ? range : undefined;
  }

  private buildNumberRangeFilter(
    min?: number,
    max?: number,
  ): ProductPersistenceFilter {
    const range: ProductPersistenceFilter = {};

    if (min !== undefined) {
      range.$gte = min;
    }

    if (max !== undefined) {
      range.$lte = max;
    }

    return range;
  }

  private buildSort(sortBy?: string, sortOrder?: 'asc' | 'desc'): ProductSort {
    const allowedSortFields = new Set([
      'productId',
      'status',
      'createdAt',
      'updatedAt',
    ]);
    const field =
      sortBy && allowedSortFields.has(sortBy) ? sortBy : 'createdAt';

    return {
      [field]: sortOrder === 'asc' ? 1 : -1,
    };
  }

  private translatableSearchFields(): string[] {
    return Object.values(LangIsoCodeConstants).flatMap((language) => [
      `name.${language}`,
      `description.${language}`,
    ]);
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
