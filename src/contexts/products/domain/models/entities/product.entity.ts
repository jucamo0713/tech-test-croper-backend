import type { IdValueObject } from '@shared/domain/models/value-objects/string';
import type { PriceMap, TranslatableText } from '@shared/domain/models/types';

export interface ProductProps {
  productId: IdValueObject;
  name: TranslatableText;
  description?: TranslatableText;
  prices: PriceMap;
  status?: string;
}

export interface ProductPrimitives {
  productId: string;
  name: TranslatableText;
  description?: TranslatableText;
  prices: PriceMap;
  status?: string;
}

export class Product {
  private readonly props: ProductProps;

  constructor(props: ProductProps) {
    this.props = {
      ...props,
      name: { ...props.name },
      description: props.description ? { ...props.description } : undefined,
      prices: { ...props.prices },
    };
  }

  public get id(): IdValueObject {
    return this.props.productId;
  }

  public get name(): TranslatableText {
    return { ...this.props.name };
  }

  public get description(): TranslatableText | undefined {
    return this.props.description ? { ...this.props.description } : undefined;
  }

  public get prices(): PriceMap {
    return { ...this.props.prices };
  }

  public get status(): string | undefined {
    return this.props.status;
  }

  public toPrimitives(): ProductPrimitives {
    return {
      productId: this.props.productId.toString(),
      name: { ...this.props.name },
      description: this.props.description
        ? { ...this.props.description }
        : undefined,
      prices: { ...this.props.prices },
      status: this.props.status,
    };
  }
}
