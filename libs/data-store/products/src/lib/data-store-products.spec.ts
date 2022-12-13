import { dataStoreProducts } from './data-store-products';

describe('dataStoreProducts', () => {
  it('should work', () => {
    expect(dataStoreProducts()).toEqual('data-store-products');
  });
});
