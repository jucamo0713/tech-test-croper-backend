import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtSessionGuard } from '@shared/infrastructure/driven-adapters/nestjs/guards';
import { SwaggerEndpointDecorator } from '@shared/infrastructure/ui/controllers/swagger-endpoint.decorator';
import {
  HttpPaginationResponse,
  HttpPaginationResponseType,
} from '@shared/infrastructure/ui/controllers/responses/http-pagination.response';
import { CqrsCallerRepositoryToken } from '@shared/domain/models/gateways';
import type { CqrsCallerRepository } from '@shared/domain/models/gateways';
import {
  CreateProductCommand,
  DeleteProductCommand,
  UpdateProductCommand,
} from '@products/domain/models/cqrs/commands';
import { ProductErrorMessagesConstants } from '@products/domain/models/constants';
import {
  GetPaginatedProductsQuery,
  GetProductByIdQuery,
} from '@products/domain/models/cqrs/queries';
import {
  CreateProductRequestDto,
  GetPaginatedProductsQueryDto,
  ProductResponseDto,
  UpdateProductRequestDto,
} from '@products/infrastructure/dtos';

const PaginatedProductResponseClass =
  HttpPaginationResponse(ProductResponseDto);
type PaginatedProductResponseType = HttpPaginationResponseType<
  typeof PaginatedProductResponseClass
>;

@ApiTags('products')
@Controller('products')
@UseGuards(JwtSessionGuard)
export class ProductsController {
  constructor(
    @Inject(CqrsCallerRepositoryToken)
    private readonly cqrsCaller: CqrsCallerRepository,
  ) {}

  @Post()
  @SwaggerEndpointDecorator({
    summary: 'Create a new product',
    description: 'Create a new product',
    response: {
      status: 201,
      description: 'Product created successfully',
      type: ProductResponseDto,
    },
    errors: ['Bad request'],
  })
  create(@Body() body: CreateProductRequestDto): Promise<ProductResponseDto> {
    return this.cqrsCaller.dispatch(new CreateProductCommand(body));
  }

  @Get()
  @SwaggerEndpointDecorator({
    summary: 'Get paginated products',
    description: 'Get paginated products',
    response: {
      status: 200,
      description: 'Products retrieved successfully',
      type: PaginatedProductResponseClass,
    },
  })
  findPaginated(
    @Query() query: GetPaginatedProductsQueryDto,
  ): Promise<PaginatedProductResponseType> {
    return this.cqrsCaller.query(
      new GetPaginatedProductsQuery(query.toCriteria()),
    );
  }

  @Get(':productId')
  @SwaggerEndpointDecorator({
    summary: 'Get a product by ID',
    description: 'Get a product by ID',
    response: {
      status: 200,
      description: 'Product retrieved successfully',
      type: ProductResponseDto,
    },
    errors: [ProductErrorMessagesConstants.PRODUCT_NOT_FOUND],
  })
  findById(@Param('productId') productId: string): Promise<ProductResponseDto> {
    return this.cqrsCaller.query(new GetProductByIdQuery(productId));
  }

  @Patch(':productId')
  @SwaggerEndpointDecorator({
    summary: 'Update a product',
    description: 'Update a product',
    response: {
      status: 200,
      description: 'Product updated successfully',
      type: ProductResponseDto,
    },
    errors: [ProductErrorMessagesConstants.PRODUCT_NOT_FOUND],
  })
  update(
    @Param('productId') productId: string,
    @Body() body: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    return this.cqrsCaller.dispatch(new UpdateProductCommand(productId, body));
  }

  @Delete(':productId')
  @SwaggerEndpointDecorator({
    summary: 'Delete a product',
    description: 'Delete a product',
    response: {
      status: 200,
      description: 'Product deleted successfully',
    },
    errors: [ProductErrorMessagesConstants.PRODUCT_NOT_FOUND],
  })
  delete(@Param('productId') productId: string): Promise<void> {
    return this.cqrsCaller.dispatch(new DeleteProductCommand(productId));
  }
}
