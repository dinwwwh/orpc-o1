import { ContractPlugin } from './plugin'
import { ContractRoute, MergeRouteResponses, RouteResponses } from './route'
import { ContractRouter, createEnhancedContractRouter, EnhancedContractRouter } from './router'
import { HTTPMethod, HTTPPath, StandardizeHTTPPath } from './types/http'
import { standardizeHTTPPath } from './utils/http'

export class ContractBuilder<TResponses extends RouteResponses = any> {
  public ['🔒']: {
    plugins?: ContractPlugin[]
  } = {}

  route<TMethod extends HTTPMethod, TPath extends HTTPPath>(
    opts: ConstructorParameters<typeof ContractRoute<TMethod, TPath>>[0]
  ): ContractRoute<TMethod, StandardizeHTTPPath<TPath>, any, any, any, any, TResponses> {
    const route = new ContractRoute({
      ...opts,
      path: standardizeHTTPPath(opts.path),
    })

    if (this['🔒'].plugins) {
      for (const plugin of this['🔒'].plugins) {
        route.use(plugin)
      }
    }

    return route as any
  }

  router<TRouter extends ContractRouter>(router: TRouter): EnhancedContractRouter<TRouter> {
    return createEnhancedContractRouter(router)
  }

  plugin(opts: { name: string }): ContractPlugin {
    return new ContractPlugin(opts)
  }

  use<T extends ContractPlugin>(
    plugin: T
  ): ContractBuilder<
    T extends ContractPlugin<infer T2Responses>
      ? MergeRouteResponses<TResponses, T2Responses>
      : never
  > {
    const builder = new ContractBuilder()

    builder['🔒'].plugins ??= []

    if (this['🔒'].plugins) {
      builder['🔒'].plugins.push(...this['🔒'].plugins)
    }

    builder['🔒'].plugins.push(plugin)

    return builder as any
  }
}
