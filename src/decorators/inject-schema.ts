import { RepositorySchema, Storable } from '../interfaces'

export function InjectSchema<S extends Storable<K>, K extends string | number = string>(collection: string, schema: RepositorySchema<S, K>) {
  return function <T extends { new ( ...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(collection, schema)
      }
    }
  }
}