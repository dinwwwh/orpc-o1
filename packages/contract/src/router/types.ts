import { ContractRoute } from '../route'
import { HTTPPath, MergeHTTPPaths } from '../types/http'
import { ContractRouter } from './def'

export type PrefixContractRouterHTTPPaths<
  TRouter extends ContractRouter,
  TPrefix extends HTTPPath = any
> = {
  [K in keyof TRouter]: TRouter[K] extends ContractRoute<
    infer TMethod,
    infer TPath,
    infer TParamsSchema,
    infer TQuerySchema,
    infer THeadersSchema,
    infer TBodySchema,
    infer TResponses
  >
    ? ContractRoute<
        TMethod,
        MergeHTTPPaths<TPrefix, TPath>,
        TParamsSchema,
        TQuerySchema,
        THeadersSchema,
        TBodySchema,
        TResponses
      >
    : PrefixContractRouterHTTPPaths<TRouter[K], TPrefix>
}
