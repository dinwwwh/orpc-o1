import { RouterContractSpecification } from '@orpc/contract'
import { ServerRouterSpecification } from '../specifications/router'
import { ServerContext } from '../types'

export class ServerRouterBuilder<
  TContext extends ServerContext = ServerContext,
  TContract extends RouterContractSpecification = RouterContractSpecification
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
