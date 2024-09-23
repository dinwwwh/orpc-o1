import { Plugin } from './plugin'
import { Route } from './route'
import { createEnhancedRouter, EnhancedRouter, Router } from './router'
import { HTTPMethod, HTTPPath, StandardizeHTTPPath } from './types/http'
import { standardizeHTTPPath } from './utils/http'

export class Builder {
  route<TMethod extends HTTPMethod, TPath extends HTTPPath>(
    opts: ConstructorParameters<typeof Route<TMethod, TPath>>[0]
  ): Route<TMethod, StandardizeHTTPPath<TPath>> {
    return new Route({
      ...opts,
      path: standardizeHTTPPath(opts.path),
    }) as any
  }

  router<TRouter extends Router>(router: TRouter): EnhancedRouter<TRouter> {
    return createEnhancedRouter(router)
  }

  plugin(opts: { name: string }): Plugin {
    return new Plugin({
      name: opts.name,
      responses: {},
    })
  }
}
