import { Storable, StorableProperties } from './storable'

export interface Repository<S extends Storable<K>, K extends string | number = string> {
  create(properties: StorableProperties<S, K>): Promise<S | undefined>
  get(id: K): Promise<S | undefined>
}