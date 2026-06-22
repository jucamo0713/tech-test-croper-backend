import type { CurrencyConstants } from '@shared/domain/models/constants';

export type ProductSortOrder = 'asc' | 'desc';

export interface ProductPaginationFilters {
  search?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: CurrencyConstants;
  createdFrom?: Date;
  createdTo?: Date;
  updatedFrom?: Date;
  updatedTo?: Date;
}

export interface ProductPaginationCriteria {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: ProductSortOrder;
  filters?: ProductPaginationFilters;
}
