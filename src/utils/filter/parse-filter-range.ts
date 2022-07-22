import { Range } from '../../interfaces'

export function parseFilterRange<T>(range: Range<T>) {
  return {
    ...(range.end && {
      $lte: range.end
    }),
    ...(range.start && {
      $gte: range.start
    }),
  }
}