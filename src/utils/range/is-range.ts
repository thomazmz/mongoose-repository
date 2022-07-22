import { Range } from '../../interfaces'

export function isRange<S>(mightBeRange: any): mightBeRange is Range<S> {
  return mightBeRange.start || mightBeRange.end
}