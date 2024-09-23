import { Plugin } from './plugin'
import { MergeRouteResponses, Route, RouteResponses } from './route'
import { createEnhancedRouter, EnhancedRouter, Router } from './router'
import { HTTPMethod, HTTPPath, StandardizeHTTPPath } from './types/http'
import { standardizeHTTPPath } from './utils/http'

export class Builder<TResponses extends RouteResponses = any> {
  public ['🔒']: {
    plugins?: Plugin[]
  } = {}

  route<TMethod extends HTTPMethod, TPath extends HTTPPath>(
    opts: ConstructorParameters<typeof Route<TMethod, TPath>>[0]
  ): Route<TMethod, StandardizeHTTPPath<TPath>, any, any, any, any, TResponses> {
    const route = new Route({
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

  router<TRouter extends Router>(router: TRouter): EnhancedRouter<TRouter> {
    return createEnhancedRouter(router)
  }

  plugin(opts: { name: string }): Plugin {
    return new Plugin(opts)
  }

  use<T extends Plugin>(
    plugin: T
  ): Builder<
    T extends Plugin<infer T2Responses> ? MergeRouteResponses<TResponses, T2Responses> : never
  > {
    const builder = new Builder()

    builder['🔒'].plugins ??= []

    if (this['🔒'].plugins) {
      builder['🔒'].plugins.push(...this['🔒'].plugins)
    }

    builder['🔒'].plugins.push(plugin)

    return builder as any
  }
}
