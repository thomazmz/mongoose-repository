export type StorablePartial<S extends Storable<T>, T extends string | number = string> = Storable<T> & Partial<Omit<S, keyof Storable<T>>>

export type StorableProperties<S extends Storable<T>, T extends string | number = string> = Omit<S, keyof Storable>

export type StorablePropertiesPartial<S extends Storable<T>, T extends string | number = string> = Omit<Partial<S>, keyof Storable>

export type Storable<T extends string | number = string> = {
  id: T,
  createdAt: Date,
  updatedAt: Date,
}
