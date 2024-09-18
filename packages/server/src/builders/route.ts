import { RouteContractSpecification } from '@orpc/contract'
import { ServerMiddlewareOutput, ServerMiddlewareSpecification } from '../specifications/middleware'
import {
  ServerRouteHandler,
  ServerRouteHandlerOutput,
  ServerRouteSpecification,
} from '../specifications/route'
import { ServerContext } from '../types'

export class ServerRouteBuilder<
  TContext extends ServerContext = ServerContext,
  TContract extends RouteContractSpecification = RouteContractSpecification,
  TCurrentContext extends ServerContext = TContext
> {
  public ['🔓']: {
    contract: TContract
    middlewares: ServerMiddlewareSpecification[]
  }

  constructor(private routeContract: TContract) {
    this['🔓'] = {
      contract: routeContract,
      middlewares: [],
    }
  }

  middleware<TMiddleware extends ServerMiddlewareSpecification<TCurrentContext, TContract>>(
    middleware: TMiddleware
  ): ServerRouteBuilder<
    TContext,
    TContract,
    Awaited<ReturnType<TMiddleware>> extends ServerMiddlewareOutput<infer TCurrentContext>
      ? TCurrentContext
      : TContext
  > {
    this['🔓'].middlewares.push(middleware)

    return this as any
  }

  handler(
    handler: ServerRouteHandler<TCurrentContext, TContract>
  ): ServerRouteSpecification<TContext, TContract> {
    return new ServerRouteSpecification<TContext, TContract>({
      contract: this.routeContract,
      handler: async (input, ...others) => {
        let context: TContext = input.context

        for (const middleware of this['🔓'].middlewares) {
          const output = await middleware({ ...input, context: context }, ...others)

          if (typeof output !== 'object' || output === null) continue

          if ('context' in output) {
            context = output.context
          }

          if ('response' in output) {
            return output.response as ServerRouteHandlerOutput<TContract>
          }
        }

        // * Now context has been become `TCurrentContext`
        return await handler({ ...input, context: context } as any, ...others)
      },
    })
  }
}
