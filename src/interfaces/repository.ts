import { Filter } from './filter'
import { Query } from './query'
import { Storable, StorableProperties } from './storable'

export interface Repository<S extends Storable<K>, K extends string | number = string> {
  create(properties: StorableProperties<S, K>): Promise<S |undefined>
  create(properties: StorableProperties<S, K>[]): Promise<S[]>
  createOne(properties: StorableProperties<S, K>): Promise<S |undefined>
  createMany(properties: StorableProperties<S, K>[]): Promise<S[]>
  get(ids: K[]): Promise<S[]>
  get(ids: K): Promise<S | undefined>
  get(filter: Filter<S>): Promise<S[]>
  get(query: Query<S>): Promise<S[]>
  getById(id: K): Promise<S | undefined>
  getByIds(ids: K[]): Promise<S[]>
  getByFilter(filter: Filter<S>): Promise<S[]>
  getByQuery(query: Query<S>): Promise<S[]>
  
}