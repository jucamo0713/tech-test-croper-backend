import { Command } from '@nestjs/cqrs';
import type { PriceMap, TranslatableText } from '@shared/domain/models/types';
import type { ProductPrimitives } from '@products/domain/models/entities';

export interface CreateProductCommandPayload {
  name: TranslatableText;
  description?: TranslatableText;
  prices: PriceMap;
  status?: string;
}

export class CreateProductCommand extends Command<ProductPrimitives> {
  constructor(public readonly payload: CreateProductCommandPayload) {
    super();
  }
}
