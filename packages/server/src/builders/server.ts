import type { RouterContractSpecification } from '@orpc/contract'
import { RouteContractSpecification } from '@orpc/contract'
import { ServerContext } from '../types'
import { ServerRouteBuilder } from './route'
import { ServerRouterBuilder } from './router'

export class ServerBuilder<TContext extends ServerContext = ServerContext> {
  context<TContext extends ServerContext>(): ServerBuilder<TContext> {
    return this as any
  }

  contract<TContract extends RouteContractSpecification | RouterContractSpecification>(
    contract: TContract
  ): ChainableContractImplementer<TContext, TContract> {
    return createChainableContractImplementer<TContext, TContract>(contract)
  }
}

export type ChainableContractImplementer<
  TContext extends ServerContext = ServerContext,
  TContract extends RouteContractSpecification | RouterContractSpecification =
    | RouteContractSpecification
    | RouterContractSpecification
> = TContract extends RouteContractSpecification
  ? ServerRouteBuilder<TContext, TContract>
  : {
      [K in keyof TContract]: ChainableContractImplementer<TContext, TContract[K]>
    } & ServerRouterBuilder<TContext, TContract>

export function createChainableContractImplementer<
  TContext extends ServerContext = ServerContext,
  TContract extends RouteContractSpecification | RouterContractSpecification =
    | RouteContractSpecification
    | RouterContractSpecification
>(contract: TContract): ChainableContractImplementer<TContext, TContract> {
  if (contract instanceof RouteContractSpecification) {
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
