export type PaginatedResponse<T> = {
  items: T[];
  offset: number;
  limit: number;
  count: number;
};
