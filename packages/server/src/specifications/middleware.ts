import { RouteContractSpecification } from '@orpc/contract'
import { Promisable } from 'type-fest'
import { ServerContext } from '../types'
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
