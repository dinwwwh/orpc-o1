import { ContractPlugin } from './plugin'
import { contractRouteUsePlugin, ContractRouteUsePlugin } from './plugin/route'
import { ContractRoute } from './route'
import { ContractRouter, createEnhancedContractRouter, EnhancedContractRouter } from './router'
import { HTTPMethod, HTTPPath, StandardizeHTTPPath } from './types/http'
import { MergeUnions } from './types/utils'
import { standardizeHTTPPath } from './utils/http'

export class ContractBuilder<TPlugin extends ContractPlugin = any> {
  constructor(
    public __cb: {
      plugins?: TPlugin[]
    } = {}
  ) {}

  route<TMethod extends HTTPMethod, TPath extends HTTPPath>(
    opts: ConstructorParameters<typeof ContractRoute<TMethod, TPath>>[0]
  ): ContractRouteUsePlugin<ContractRoute<TMethod, StandardizeHTTPPath<TPath>>, TPlugin> {
    const route = new ContractRoute({
      ...opts,
      path: standardizeHTTPPath(opts.path),
    })

    if (this.__cb.plugins) {
      return contractRouteUsePlugin(route, this.__cb.plugins) as any
    }

    return route as any
  }

  router<TRouter extends ContractRouter>(router: TRouter): EnhancedContractRouter<TRouter> {
    return createEnhancedContractRouter(router)
  }

  plugin(opts: { name: string }): ContractPlugin {
    return new ContractPlugin(opts)
  }

  use<T extends ContractPlugin>(plugin: T): ContractBuilder<MergeUnions<TPlugin, T>> {
    return new ContractBuilder({
      plugins: [...(this.__cb.plugins ?? []), plugin],
    }) as any
  }
}
