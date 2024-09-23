import { UnknownRecord } from 'type-fest'
import { isContractRoute } from '../route'
import { HTTPPath } from '../types/http'
import { ContractRouter } from './def'
import { PrefixContractRouterHTTPPaths } from './types'

export type EnhancedContractRouter<TRouter extends ContractRouter> = TRouter & {
  prefix<TPrefix extends HTTPPath>(
    prefix: TPrefix
  ): EnhancedContractRouter<PrefixContractRouterHTTPPaths<TRouter, TPrefix>>
}

export function createEnhancedContractRouter<TRouter extends ContractRouter>(
  router: TRouter
): EnhancedContractRouter<TRouter> {
  const enhancedRouter = new Proxy(router as UnknownRecord, {
    get(rootTarget, prop) {
      if (prop === 'prefix') {
        return new Proxy(
          Object.assign(() => {}, Reflect.get(rootTarget, prop) ?? {}),
          {
            apply(_target, _thisArg, argArray) {
              const applyPrefix = (router: ContractRouter) => {
                for (const key in router) {
                  const item = router[key]

                  if (isContractRoute(item)) {
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
