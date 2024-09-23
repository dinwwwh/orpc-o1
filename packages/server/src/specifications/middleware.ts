import { Route } from '@orpc/contract'
import { Promisable } from 'type-fest'
import { Context } from '../types'
import { ServerRouteHandlerInput, ServerRouteHandlerOutput } from './route'

export interface ServerMiddlewareSpecification<
  TContext extends Context = any,
  TContract extends Route = any
> {
  (input: ServerRouteHandlerInput<TContext, TContract>): Promisable<
    ServerMiddlewareOutput<Context, TContract>
  >
}

export type ServerMiddlewareOutput<
  TContext extends Context = any,
  TContract extends Route = any
> = {
  context?: TContext
  response?: ServerRouteHandlerOutput<TContract>
} | void
