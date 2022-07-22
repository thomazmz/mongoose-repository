
import { Storable, StorableProperties} from './storable'
import { SchemaDefinitionProperty } from 'mongoose'

export type Schema<S extends Storable<K>, K extends string | number = string, P = StorableProperties<S, K>> = {
  [key in keyof P]: SchemaDefinitionProperty<P[key]>
}
