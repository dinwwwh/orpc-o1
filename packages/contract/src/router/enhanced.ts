import { UnknownRecord } from 'type-fest'
import { isRoute } from '../route'
import { HTTPPath } from '../types/http'
import { Router } from './def'
import { MergeRouterHTTPPaths } from './types'

export type EnhancedRouter<TRouter extends Router> = TRouter & {
  prefix<TPrefix extends HTTPPath>(
    prefix: TPrefix
  ): EnhancedRouter<MergeRouterHTTPPaths<TRouter, TPrefix>>
}

export function createEnhancedRouter<TRouter extends Router>(
  router: TRouter
): EnhancedRouter<TRouter> {
  const enhancedRouter = new Proxy(router as UnknownRecord, {
    get(rootTarget, prop) {
      if (prop === 'prefix') {
        return new Proxy(
          Object.assign(() => {}, Reflect.get(rootTarget, prop) ?? {}),
          {
            apply(_target, _thisArg, argArray) {
              const applyPrefix = (router: Router) => {
                for (const key in router) {
                  const item = router[key]

                  if (isRoute(item)) {
                    item.prefix(argArray[0])
                  } else {
                    applyPrefix(item)
                  }
                }
              }

              applyPrefix(rootTarget)

              return enhancedRouter
            },
          }
        )
      }

      return Reflect.get(rootTarget, prop)
    },
  })

  return enhancedRouter as any
}
