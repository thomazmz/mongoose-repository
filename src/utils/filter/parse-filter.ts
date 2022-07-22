import { Filter } from 'interfaces';
import { parseFilterEntry } from './parse-filter-entry';

export function parseFilter<S>(filter: Filter<S> = {}) {
  return Object.entries(filter).reduce((acc, entry) => {
    return {
      ...acc,
      ...parseFilterEntry(...entry)
    }
  }, {})
}