import { IsAny } from 'type-fest'
import { ContractRoute } from '../route'
import { MergeUnions } from '../types/utils'
import { ContractPlugin } from './def'

export type ContractRouteUsePlugin<
  TRoute extends ContractRoute,
  TPlugin extends ContractPlugin
> = IsAny<TPlugin> extends true
  ? TRoute
  : TPlugin extends ContractPlugin<infer TResponse1>
  ? TRoute extends ContractRoute<
      infer TMethod,
      infer TPath,
      infer TParamsSchema,
      infer TQuerySchema,
      infer THeadersSchema,
      infer TBodySchema,
      infer TResponse2
    >
    ? ContractRoute<
        TMethod,
        TPath,
        TParamsSchema,
        TQuerySchema,
        THeadersSchema,
        TBodySchema,
        MergeUnions<TResponse2, TResponse1>
      >
    : never
  : never

export function contractRouteUsePlugin<
  TRoute extends ContractRoute,
  TPlugin extends ContractPlugin
>(route: TRoute, plugins: TPlugin[]): ContractRouteUsePlugin<TRoute, TPlugin> {
  for (const plugin of plugins) {
    if (plugin.__cp.responses) {
      route.__cr.responses ??= []
      route.__cr.responses.push(...plugin.__cp.responses)
    }
  }

  return route as any
}
