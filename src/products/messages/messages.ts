export const productMessages = {
  SlugInUse: () => 'Slug already in use',
  CategoryNotFound: (id: number) =>
    `Invalid categoryId. Category with id ${id} not found`,
  ProductNotFound: (id: number) => `Product with id ${id} not found`,
  ProductNotFoundBySlug: (slug: string) =>
    `Product with slug ${slug} not found`,
};
