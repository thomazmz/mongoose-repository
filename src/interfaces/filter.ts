import { Range } from './range'

type FilterOF<T> = 
  T extends Date ? Range<Date> | Range<Date>[] :
  T extends number ? number | number[] | Range<number> | Range<number>[] :
  T extends bigint ? bigint | bigint[] | Range<bigint> | Range<bigint>[] :
  T | T[]

export type Filter<T> = {
  [K in keyof T]?: FilterOF<T[K]>
}
