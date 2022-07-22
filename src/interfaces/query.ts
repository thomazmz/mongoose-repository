import { Filter } from './filter'
import { Sort } from './sort'

export type Query<T> = {
  filter: Filter<T>,
  sort?: Sort<T>
} | {
  filter?: Filter<T>,
  sort: Sort<T>
}