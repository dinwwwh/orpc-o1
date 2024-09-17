import { RouterContractSpecification } from '@orpc/contract/__internal__/specifications/router'
import { ServerRouterSpecification } from 'src/specifications/router'
import { ServerContext } from 'src/types'

export class ServerRouterBuilder<
  TContext extends ServerContext = ServerContext,
  TContract extends RouterContractSpecification = RouterContractSpecification
> {
  public __internal__: {
    contract: TContract
  }

  constructor(routerContract: TContract) {
    this.__internal__ = {
      contract: routerContract,
    }
  }

  router(
    router: ServerRouterSpecification<TContext, TContract>
  ): ServerRouterSpecification<TContext, TContract> {
    return router
  }
}
