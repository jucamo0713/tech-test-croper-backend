import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import type { PriceMap, TranslatableText } from '@shared/domain/models/types';

export class CreateProductRequestDto {
  @ApiProperty({
    example: {
      en: 'Coffee',
      es: 'Cafe',
    },
  })
  @IsObject()
  name: TranslatableText;

  @ApiPropertyOptional({
    example: {
      en: 'Roasted coffee',
      es: 'Cafe tostado',
    },
  })
  @IsObject()
  @IsOptional()
  description?: TranslatableText;

  @ApiProperty({
    example: {
      USD: 10,
      COP: 40000,
    },
  })
  @IsObject()
  prices: PriceMap;

  @ApiPropertyOptional({ example: 'active' })
  @IsString()
  @IsOptional()
  status?: string;
}
