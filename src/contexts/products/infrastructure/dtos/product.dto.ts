import type { PriceMap, TranslatableText } from '@shared/domain/models/types';

export interface ProductDto {
  productId: string;
  name: TranslatableText;
  description?: TranslatableText;
  prices: PriceMap;
  status?: string;
}
