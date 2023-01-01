import { ProductCategory } from '@kiraya/data-store/products';

const categories: ProductCategory[] = [
  { id: 'books', label: 'Books' },
  { id: 'musicalInstruments', label: 'Musical instruments' },
  { id: 'homeAppliances', label: 'Home Appliances' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'decor', label: 'Decor' },
  { id: 'storage', label: 'Storage' },
];

export function getCategoryDetails(id: Categories) {
  const category = categories.find((category) => category.id === id);
  return category;
}

export type Categories =
  | 'books'
  | 'musicalInstruments'
  | 'homeAppliances'
  | 'furniture'
  | 'decor'
  | 'storage';

export { categories };
