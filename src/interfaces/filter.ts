import { Range } from './range'

type FilterProperty<T> = 
  T extends Date ? Range<Date> | Range<Date>[] :
  T extends number ? number | number[] | Range<number> | Range<number>[] :
  T extends bigint ? bigint | bigint[] | Range<bigint> | Range<bigint>[] :
  T extends boolean ? true | false :
  T | T[]

export type Filter<T> = {
  [K in keyof T]?: FilterProperty<T[K]>
}
