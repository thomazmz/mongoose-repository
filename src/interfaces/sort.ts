export type SortOrder = 'ascending' | 'descending'

export type Sort<T> = {
  offset?: number
  limit?: number
  property?: keyof T | (keyof T)[]
  order?: SortOrder
};
