import { Product } from '@products/domain/models/entities';
import { ProductMother } from '../../../../../../mothers-and-mocks/contexts/products/domain/models/entities/product.entity.mother';

describe('Product', () => {
  describe('constructor', () => {
    it('should create a product with valid props', () => {
      const props = ProductMother.props();

      const product = new Product(props);

      expect(product).toBeInstanceOf(Product);
      expect(product.id).toBe(props.productId);
      expect(product.name).toEqual(props.name);
      expect(product.description).toEqual(props.description);
      expect(product.prices).toEqual(props.prices);
      expect(product.status).toBe(props.status);
    });
  });

  describe('toPrimitives', () => {
    it('should return product primitive values', () => {
      const props = ProductMother.props();
      const product = new Product(props);

      expect(product.toPrimitives()).toEqual({
        productId: props.productId.toString(),
        name: props.name,
        description: props.description,
        prices: props.prices,
        status: props.status,
      });
    });
  });
});
