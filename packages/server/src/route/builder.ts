import { ContractRoute } from '@orpc/contract'
import { ServerMiddlewareOutput, ServerMiddlewareSpecification } from '../plugin/middleware'
import { ServerContext } from '../types'
import { RouteHandler, RouteHandlerOutput, ServerRoute } from './def'

export class ServerRouteBuilder<
  TContext extends ServerContext = any,
  TContract extends ContractRoute = any,
  TCurrentContext extends ServerContext = any
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

  handler(handler: RouteHandler<TCurrentContext, TContract>): ServerRoute<TContext, TContract> {
    return new ServerRoute<TContext, TContract>({
      contract: this.routeContract,
      handler: async (input, ...others) => {
        let context: TContext = input.context

        for (const middleware of this['🔓'].middlewares) {
          const output = await middleware({ ...input, context: context }, ...others)

          if (typeof output !== 'object' || output === null) continue

          if ('context' in output && typeof input.context === 'object' && input.context !== null) {
            context = {
              ...context,
              ...output.context,
            }
          }

          if ('response' in output) {
            return output.response as RouteHandlerOutput<TContract>
          }
        }

        // * Now context has been become `TCurrentContext`
        return await handler({ ...input, context: context } as any, ...others)
      },
    })
  }
}
