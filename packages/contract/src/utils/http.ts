import { trim } from 'radash'
import { HTTPPath, MergeHTTPPaths } from '../types/http'

export function standardizeHTTPPath<T extends HTTPPath>(path: T): T {
  return `/${trim(path.replace(/\/+/g, '/'), '/')}` as any
}

export function mergeHTTPPaths<TA extends HTTPPath, TB extends HTTPPath>(
  a: TA,
  b: TB
): MergeHTTPPaths<TA, TB> {
  return `/${trim(a, '/')}/${trim(b, '/')}` as any
}
