import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import type { PriceMap, TranslatableText } from '@shared/domain/models/types';

export class UpdateProductRequestDto {
  @ApiPropertyOptional({
    example: {
      en: 'Coffee',
      es: 'Cafe',
    },
  })
  @IsObject()
  @IsOptional()
  name?: TranslatableText;

  @ApiPropertyOptional({
    example: {
      en: 'Roasted coffee',
      es: 'Cafe tostado',
    },
  })
  @IsObject()
  @IsOptional()
  description?: TranslatableText;

  @ApiPropertyOptional({
    example: {
      USD: 10,
      COP: 40000,
    },
  })
  @IsObject()
  @IsOptional()
  prices?: PriceMap;

  @ApiPropertyOptional({ example: 'active' })
  @IsString()
  @IsOptional()
  status?: string;
}
