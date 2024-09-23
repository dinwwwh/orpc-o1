import type { ContractRouter } from '@orpc/contract'
import { ContractRoute, isContractRoute } from '@orpc/contract'
import { ServerRouteBuilder } from './route'
import { ServerRouterBuilder } from './router'
import { ServerContext } from './types'

export class ServerBuilder<TContext extends ServerContext = any> {
  context<TContext extends ServerContext>(): ServerBuilder<TContext> {
    return this as any
  }

  contract<TContract extends ContractRoute | ContractRouter>(
    contract: TContract
  ): ChainableContractImplementer<TContext, TContract> {
    return createChainableContractImplementer<TContext, TContract>(contract)
  }
}

export type ChainableContractImplementer<
  TContext extends ServerContext = ServerContext,
  TContract extends ContractRoute | ContractRouter = ContractRoute | ContractRouter
> = TContract extends ContractRoute
  ? ServerRouteBuilder<TContext, TContract, TContext>
  : {
      [K in keyof TContract]: ChainableContractImplementer<TContext, TContract[K]>
    } & ServerRouterBuilder<TContext, TContract>

export function createChainableContractImplementer<
  TContext extends ServerContext = ServerContext,
  TContract extends ContractRoute | ContractRouter = ContractRoute | ContractRouter
>(contract: TContract): ChainableContractImplementer<TContext, TContract> {
  if (isContractRoute(contract)) {
    return new ServerRouteBuilder(contract) as any
  }

  return new Proxy(new ServerRouterBuilder(contract), {
    get(target, key) {
      const contract = (target['🔓'].contract as ContractRouter)[key] as
        | ContractRoute
        | ContractRouter
        | undefined

      if (!contract) {
        return Reflect.get(target, key)
      }

      return createChainableContractImplementer(contract)
    },
  }) as any
}
