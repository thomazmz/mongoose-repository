import { isArray } from '../array'
import { isRange } from '../range'
import { parseFilterArray } from './parse-filter-array'
import { parseFilterRange } from './parse-filter-range'

export function parseFilterEntry(key: string, value: any) {

  if(isArray(value)) {
    return {
      [key]: parseFilterArray(value)
    }
  }

  if(isRange(value)) {
    return {
      [key]: parseFilterRange(value)
    }
  }

  return {
    [key]: value
  }
}
