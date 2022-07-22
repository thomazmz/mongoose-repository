import { Query } from '../../interfaces'

export function isQuery<S>(mightBeQuery: any): mightBeQuery is Query<S> {
  return mightBeQuery.filter !== undefined || mightBeQuery.sort !== undefined
}