import { ContractRoute } from '@orpc/contract'
import { Promisable } from 'type-fest'
import { RouteHandlerInput, RouteHandlerOutput } from '../route/def'
import { ServerContext } from '../types'

export interface ServerMiddlewareSpecification<
  TContext extends ServerContext = any,
  TContract extends ContractRoute = any
> {
  (input: RouteHandlerInput<TContext, TContract>): Promisable<
    ServerMiddlewareOutput<ServerContext, TContract>
  >
}

export type ServerMiddlewareOutput<
  TContext extends ServerContext = any,
  TContract extends ContractRoute = any
> = {
  context?: TContext
  response?: RouteHandlerOutput<TContract>
} | void
