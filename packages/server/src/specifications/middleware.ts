import { RouteContractSpecification } from '@orpc/contract/__internal__/specifications/route'
import { ServerContext } from 'src/types'
import { Promisable } from 'type-fest'
import { ServerRouteHandlerInput, ServerRouteHandlerOutput } from './route'

export interface ServerMiddlewareSpecification<
  TContext extends ServerContext = ServerContext,
  TContract extends RouteContractSpecification = RouteContractSpecification
> {
  (input: ServerRouteHandlerInput<TContext, TContract>): Promisable<
    ServerMiddlewareOutput<ServerContext, TContract>
  >
}

export type ServerMiddlewareOutput<
  TContext extends ServerContext = ServerContext,
  TContract extends RouteContractSpecification = RouteContractSpecification
> = {
  context?: TContext
  response?: ServerRouteHandlerOutput<TContract>
} | void
