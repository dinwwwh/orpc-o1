import { trim } from 'radash'
import { HTTPPath } from '../types'

export type MergeHTTPPaths<TA extends HTTPPath, TB extends HTTPPath> = TA extends '/'
  ? TB
  : TA extends `/${infer TA}/`
  ? TB extends `/${infer TB}/`
    ? `/${TA}/${TB}`
    : TB extends `/${infer TB}`
    ? `/${TA}/${TB}`
    : `/${TA}/${TB}`
  : TA extends `/${infer TA}`
  ? TB extends `/${infer TB}/`
    ? `/${TA}/${TB}`
    : TB extends `/${infer TB}`
    ? `/${TA}/${TB}`
    : `/${TA}${TB}`
  : `/${TA}${TB}`

export function mergeHTTPPaths<TA extends HTTPPath, TB extends HTTPPath>(
  a: TA,
  b: TB
): MergeHTTPPaths<TA, TB> {
  return `/${trim(a, '/')}/${trim(b, '/')}` as any
}
