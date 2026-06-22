import { Command } from '@nestjs/cqrs';
import type { PriceMap, TranslatableText } from '@shared/domain/models/types';
import type { ProductPrimitives } from '@products/domain/models/entities';

export interface UpdateProductCommandPayload {
  name?: TranslatableText;
  description?: TranslatableText;
  prices?: PriceMap;
  status?: string;
}

export class UpdateProductCommand extends Command<ProductPrimitives> {
  constructor(
    public readonly productId: string,
    public readonly payload: UpdateProductCommandPayload,
  ) {
    super();
  }
}
