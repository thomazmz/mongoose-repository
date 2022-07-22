import { isRange } from '../range'
import { parseFilterRange } from './parse-filter-range'

export function parseFilterArray<T>(array: T[]) { 
  if(array.length <= 0) {
    return {}
  }

  if(isRange(array[0])) {
    return {
      $or: array.map(parseFilterRange)
    }
  }

  return {
    $in: [ ...array ]
  }
}
