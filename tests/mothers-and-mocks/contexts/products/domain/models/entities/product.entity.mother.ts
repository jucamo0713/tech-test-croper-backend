import { ProductProps } from '@products/domain/models/entities';
import { CurrencyConstants } from '@shared/domain/models/constants/currency.constants';
import { LangIsoCodeConstants } from '@shared/domain/models/constants/lang-iso-code.constants';
import { IdValueObject } from '@shared/domain/models/value-objects/string';

class TestProductId extends IdValueObject {}

export class ProductMother {
  static props(): ProductProps {
    return {
      productId: new TestProductId('product-id'),
      name: {
        [LangIsoCodeConstants.en]: 'Coffee',
        [LangIsoCodeConstants.es]: 'Cafe',
      },
      description: {
        [LangIsoCodeConstants.en]: 'Roasted coffee',
        [LangIsoCodeConstants.es]: 'Cafe tostado',
      },
      prices: {
        [CurrencyConstants.USD]: 10,
        [CurrencyConstants.COP]: 40000,
      },
      status: 'active',
    };
  }
}
