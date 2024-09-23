import { Route } from '@orpc/contract'
import { Promisable } from 'type-fest'
import { RouteHandlerInput, RouteHandlerOutput } from '../route/def'
import { Context } from '../types'

export interface ServerMiddlewareSpecification<
  TContext extends Context = any,
  TContract extends Route = any
> {
  (input: RouteHandlerInput<TContext, TContract>): Promisable<
    ServerMiddlewareOutput<Context, TContract>
  >
}

export type ServerMiddlewareOutput<
  TContext extends Context = any,
  TContract extends Route = any
> = {
  context?: TContext
  response?: RouteHandlerOutput<TContract>
} | void
