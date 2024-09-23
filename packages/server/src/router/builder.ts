import { ContractRouter } from '@orpc/contract'
import { ServerContext } from '../types'
import { ServerRouter } from './def'

export class ServerRouterBuilder<
  TContext extends ServerContext = any,
  TContract extends ContractRouter = any
> {
  public ['🔓']: {
    contract: TContract
  }

  constructor(routerContract: TContract) {
    this['🔓'] = {
      contract: routerContract,
    }
  }

  router(router: ServerRouter<TContext, TContract>): ServerRouter<TContext, TContract> {
    return router
  }
}
