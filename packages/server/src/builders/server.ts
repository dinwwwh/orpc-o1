import type { RouterContractSpecification } from '@orpc/contract'
import { isRouteContractSpecification, RouteContractSpecification } from '@orpc/contract'
import { Context } from '../types'
import { ServerRouteBuilder } from './route'
import { ServerRouterBuilder } from './router'

export class ServerBuilder<TContext extends Context = any> {
  context<TContext extends Context>(): ServerBuilder<TContext> {
    return this as any
  }

  contract<TContract extends RouteContractSpecification | RouterContractSpecification>(
    contract: TContract
  ): ChainableContractImplementer<TContext, TContract> {
    return createChainableContractImplementer<TContext, TContract>(contract)
  }
}

export type ChainableContractImplementer<
  TContext extends Context = Context,
  TContract extends RouteContractSpecification | RouterContractSpecification =
    | RouteContractSpecification
    | RouterContractSpecification
> = TContract extends RouteContractSpecification
  ? ServerRouteBuilder<TContext, TContract, TContext>
  : {
      [K in keyof TContract]: ChainableContractImplementer<TContext, TContract[K]>
    } & ServerRouterBuilder<TContext, TContract>

export function createChainableContractImplementer<
  TContext extends Context = Context,
  TContract extends RouteContractSpecification | RouterContractSpecification =
    | RouteContractSpecification
    | RouterContractSpecification
>(contract: TContract): ChainableContractImplementer<TContext, TContract> {
  if (isRouteContractSpecification(contract)) {
    return new ServerRouteBuilder(contract) as any
  }

  return new Proxy(new ServerRouterBuilder(contract), {
    get(target, key) {
      const contract = (target['🔓'].contract as RouterContractSpecification)[key] as
        | RouteContractSpecification
        | RouterContractSpecification
        | undefined

      if (!contract) {
        return Reflect.get(target, key)
      }

      return createChainableContractImplementer(contract)
    },
  }) as any
}
