export const categoriesMessages = {
  SlugInUse: () => 'Slug already in use',
  NotFoundById: (id: number) => `Category with id ${id}, not found`,
  NotFoundBySlug: (slug: string) => `Category with slug: ${slug}, not found`,
};
