export type Sort<T> = {
  index?: number,
  limit?: number,
  attribute: keyof T | (keyof T)[],
  ordering?: 'ascending' | 'descending',
}