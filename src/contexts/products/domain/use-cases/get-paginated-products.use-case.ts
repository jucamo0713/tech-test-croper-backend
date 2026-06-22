import { Pagination } from '@shared/domain/models/entities';
import type { ProductPrimitives } from '@products/domain/models/entities';
import type {
  ProductPaginationCriteria,
  ProductPaginationFilters,
  ProductRepositoryGateway,
} from '@products/domain/models/gateways';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export class GetPaginatedProductsUseCase {
  constructor(private readonly productRepository: ProductRepositoryGateway) {}

  async execute(
    criteria: ProductPaginationCriteria,
  ): Promise<Pagination<ProductPrimitives>> {
    const result = await this.productRepository.findPaginated(
      this.normalizeCriteria(criteria),
    );

    return new Pagination(
      result.data.map((product) => product.toPrimitives()),
      result.metadata.page,
      result.metadata.limit,
      result.metadata.totalItems,
    );
  }

  private normalizeCriteria(
    criteria: ProductPaginationCriteria,
  ): Required<Omit<ProductPaginationCriteria, 'sortBy' | 'sortOrder'>> &
    Pick<ProductPaginationCriteria, 'sortBy' | 'sortOrder'> {
    const page = Math.max(
      DEFAULT_PAGE,
      Math.trunc(criteria.page ?? DEFAULT_PAGE),
    );
    const requestedLimit = Math.trunc(criteria.limit ?? DEFAULT_LIMIT);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, requestedLimit || DEFAULT_LIMIT),
    );

    return {
      page,
      limit,
      sortBy: criteria.sortBy,
      sortOrder: criteria.sortOrder,
      filters: this.cleanFilters(criteria.filters ?? {}),
    };
  }

  private cleanFilters(
    filters: ProductPaginationFilters,
  ): ProductPaginationFilters {
    return Object.fromEntries(
      Object.entries(filters).filter(([, value]) => {
        if (value === undefined || value === null) {
          return false;
        }

        if (typeof value === 'string') {
          return value.trim().length > 0;
        }

        return true;
      }),
    );
  }
}
