import { Filter } from './filter'
import { Sort } from './sort'

export type Query<T> = {
  where: Filter<T>,
  sort?: Sort<T>
} | {
  where?: Filter<T>,
  sort: Sort<T>
}