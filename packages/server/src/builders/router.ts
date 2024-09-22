import { RouterContractSpecification } from '@orpc/contract'
import { ServerRouterSpecification } from '../specifications/router'
import { Context } from '../types'

export class ServerRouterBuilder<
  TContext extends Context = any,
  TContract extends RouterContractSpecification = any
> {
  public ['🔓']: {
    contract: TContract
  }

  constructor(routerContract: TContract) {
    this['🔓'] = {
      contract: routerContract,
    }
  }

  router(
    router: ServerRouterSpecification<TContext, TContract>
  ): ServerRouterSpecification<TContext, TContract> {
    return router
  }
}
