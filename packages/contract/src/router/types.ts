import { Route } from '../route'
import { HTTPPath, MergeHTTPPaths } from '../types/http'
import { Router } from './def'

export type MergeRouterHTTPPaths<TRouter extends Router, TPrefix extends HTTPPath = any> = {
  [K in keyof TRouter]: TRouter[K] extends Route<
    infer TMethod,
    infer TPath,
    infer TParamsSchema,
    infer TQuerySchema,
    infer THeadersSchema,
    infer TBodySchema,
    infer TResponses
  >
    ? Route<
        TMethod,
        MergeHTTPPaths<TPrefix, TPath>,
        TParamsSchema,
        TQuerySchema,
        THeadersSchema,
        TBodySchema,
        TResponses
      >
    : MergeRouterHTTPPaths<TRouter[K], TPrefix>
}
