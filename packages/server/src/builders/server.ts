import { ServerContext } from 'src/types'

import { RouteContractSpecification } from '@orpc/contract/__internal__/specifications/route'
import type { RouterContractSpecification } from '@orpc/contract/__internal__/specifications/router'
import { ServerRouteBuilder } from './route'
import { ServerRouterBuilder } from './router'

export class ServerBuilder<TContext extends ServerContext = ServerContext> {
  context<TContext extends ServerContext>(): ServerBuilder<TContext> {
    return this as any
  }

  contract<TContract extends RouteContractSpecification | RouterContractSpecification>(
    contract: TContract
  ): TContract extends RouteContractSpecification
    ? ServerRouteBuilder<TContext, TContract>
    : TContract extends RouterContractSpecification
    ? ServerRouterBuilder<TContext, TContract>
    : unknown {
    if (contract instanceof RouteContractSpecification) {
      return new ServerRouteBuilder(contract) as any
    }

    return new ServerRouterBuilder(contract) as any
  }
}
