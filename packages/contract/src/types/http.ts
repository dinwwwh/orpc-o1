export type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
export type HTTPPath = `/${string}`
export type HTTPSuccessStatus = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210
export type HTTPErrorStatus =
  | 100
  | 101
  | 102
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 419
  | 420
  | 421
  | 422
  | 423
  | 424
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 507
  | 511
export type HTTPStatus = HTTPSuccessStatus | HTTPErrorStatus

export type StandardizeHTTPPath<T extends HTTPPath> = T extends ''
  ? '/'
  : T extends '/'
  ? '/'
  : T extends `/${infer P1}//${infer P2}`
  ? StandardizeHTTPPath<`/${P1}/${P2}`>
  : T extends `//${infer P}`
  ? StandardizeHTTPPath<`/${P}`>
  : T extends `/${infer P}//`
  ? StandardizeHTTPPath<`/${P}`>
  : T extends `/${infer P}/`
  ? StandardizeHTTPPath<`/${P}`>
  : T

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
