import { RouteContractSpecification } from '@orpc/contract/__internal__/specifications/route'
import { ServerRouteHandler, ServerRouteSpecification } from 'src/specifications/route'
import { ServerContext } from 'src/types'

export class ServerRouteBuilder<
  TContext extends ServerContext = ServerContext,
  TContract extends RouteContractSpecification = RouteContractSpecification
> {
  constructor(private routeContract: TContract) {}

  handler(
    handler: ServerRouteHandler<TContext, TContract>
  ): ServerRouteSpecification<TContext, TContract> {
    return new ServerRouteSpecification({
      contract: this.routeContract,
      handler,
    })
  }
}
