export function isArray<S>(mightBeArray: any): mightBeArray is Array<S> {
  return Array.isArray(mightBeArray)
}