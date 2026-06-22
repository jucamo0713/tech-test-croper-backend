import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';
import {
  CurrencyConstants,
  SharedErrorMessagesConstants,
} from '@shared/domain/models/constants';
import type {
  ProductPaginationCriteria,
  ProductPaginationFilters,
  ProductSortOrder,
} from '@products/domain/models/gateways';
import { HttpBasePaginationRequest } from '@shared/infrastructure/ui/controllers/requests/http-base-pagination.request';

const toDate = ({ value }: { value: unknown }): Date | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    value instanceof Date
  ) {
    return new Date(value);
  }

  return undefined;
};

export class GetPaginatedProductsQueryDto extends HttpBasePaginationRequest {
  @ApiPropertyOptional({ example: 10, maximum: 100, minimum: 1, type: Number })
  @Max(100)
  @IsPositive({
    message: SharedErrorMessagesConstants.LIMIT_MUST_BE_POSITIVE,
  })
  @IsInt({
    message: SharedErrorMessagesConstants.LIMIT_MUST_BE_INTEGER,
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: SharedErrorMessagesConstants.LIMIT_MUST_BE_NUMBER,
    },
  )
  @IsOptional()
  @Type(() => Number)
  override limit: number | undefined = undefined;

  @ApiPropertyOptional({ example: 'createdAt' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: ProductSortOrder;

  @ApiPropertyOptional({ example: 'coffee' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 10 })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({ example: 100 })
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional({ enum: CurrencyConstants })
  @IsEnum(CurrencyConstants)
  @IsOptional()
  currency?: CurrencyConstants;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z' })
  @Transform(toDate)
  @IsDate()
  @IsOptional()
  createdFrom?: Date;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.999Z' })
  @Transform(toDate)
  @IsDate()
  @IsOptional()
  createdTo?: Date;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z' })
  @Transform(toDate)
  @IsDate()
  @IsOptional()
  updatedFrom?: Date;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.999Z' })
  @Transform(toDate)
  @IsDate()
  @IsOptional()
  updatedTo?: Date;

  toCriteria(): ProductPaginationCriteria {
    const filters: ProductPaginationFilters = {
      search: this.search,
      status: this.status,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      currency: this.currency,
      createdFrom: this.createdFrom,
      createdTo: this.createdTo,
      updatedFrom: this.updatedFrom,
      updatedTo: this.updatedTo,
    };

    return {
      page: this.page,
      limit: this.limit,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      filters,
    };
  }
}
