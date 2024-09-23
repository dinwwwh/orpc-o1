import { Router as ContractRouter } from '@orpc/contract'
import { Context } from '../types'
import { Router } from './def'

export class RouterBuilder<TContext extends Context = any, TContract extends ContractRouter = any> {
  public ['🔓']: {
    contract: TContract
  }

  constructor(routerContract: TContract) {
    this['🔓'] = {
      contract: routerContract,
    }
  }

  router(router: Router<TContext, TContract>): Router<TContext, TContract> {
    return router
  }
}
