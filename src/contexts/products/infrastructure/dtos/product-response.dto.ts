import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { PriceMap, TranslatableText } from '@shared/domain/models/types';

export class ProductResponseDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: TranslatableText;

  @ApiPropertyOptional()
  description?: TranslatableText;

  @ApiProperty()
  prices: PriceMap;

  @ApiPropertyOptional()
  status?: string;
}
