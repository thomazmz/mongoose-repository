import { Filter } from './filter'
import { Query } from './query'
import { Storable, StorableProperties } from './storable'

export interface Repository<S extends Storable<K>, K extends string | number = string> {
  create(properties: StorableProperties<S, K>): Promise<S | undefined>
  
  get(ids: K[]): Promise<S[]>
  get(ids: K): Promise<S | undefined>
  get(filter: Filter<S>): Promise<S[]>
  get(query: Query<S>): Promise<S[]>
}