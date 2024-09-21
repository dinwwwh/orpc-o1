import { UnknownRecord } from 'type-fest'
import { HTTPPath, MergeHTTPPaths } from '../types/http'
import { isRouteContractSpecification, RouteContractSpecification } from './route'

export type RouterContractSpecification<
  T extends Record<string, RouteContractSpecification | RouterContractSpecification> = any
> = T

export type MergeRouterContractSpecificationsHTTPPaths<
  TRouter extends RouterContractSpecification,
  TPrefix extends HTTPPath = any
> = {
  [K in keyof TRouter]: TRouter[K] extends RouteContractSpecification<
    infer TMethod,
    infer TPath,
    infer TParamsSchema,
    infer TQuerySchema,
    infer THeadersSchema,
    infer TBodySchema,
    infer TResponses
  >
    ? RouteContractSpecification<
        TMethod,
        MergeHTTPPaths<TPrefix, TPath>,
        TParamsSchema,
        TQuerySchema,
        THeadersSchema,
        TBodySchema,
        TResponses
      >
    : MergeRouterContractSpecificationsHTTPPaths<TRouter[K], TPrefix>
}

export type EnhancedRouterContractSpecification<TRouter extends RouterContractSpecification> =
  TRouter & {
    prefix<TPrefix extends HTTPPath>(
      prefix: TPrefix
    ): EnhancedRouterContractSpecification<
      MergeRouterContractSpecificationsHTTPPaths<TRouter, TPrefix>
    >
  }

export function createEnhancedRouterContractSpecification<
  TRouter extends RouterContractSpecification
>(router: TRouter): EnhancedRouterContractSpecification<TRouter> {
  const enhancedRouter = new Proxy(router as UnknownRecord, {
    get(rootTarget, prop) {
      if (prop === 'prefix') {
        return new Proxy(
          Object.assign(() => {}, Reflect.get(rootTarget, prop) ?? {}),
          {
            apply(_target, _thisArg, argArray) {
              const applyPrefix = (router: RouterContractSpecification) => {
                for (const key in router) {
                  const item = router[key]

                  if (isRouteContractSpecification(item)) {
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
