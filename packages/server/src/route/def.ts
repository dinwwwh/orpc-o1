import { ContractRoute, HTTPPath, InferInputResponse } from '@orpc/contract'
import { Promisable } from 'type-fest'
import { InferOutput } from 'valibot'
import { ServerContext } from '../types'

export class ServerRoute<
  TContext extends ServerContext = any,
  TContract extends ContractRoute = any
> {
  public ['🔓']: {
    contract: TContract
    handler: RouteHandler<TContext, TContract>
  }

  constructor(opts: { contract: TContract; handler: RouteHandler<TContext, TContract> }) {
    this['🔓'] = {
      contract: opts.contract,
      handler: opts.handler,
    }
  }
}

export interface RouteHandler<
  TContext extends ServerContext = any,
  TContract extends ContractRoute = any
> {
  (input: RouteHandlerInput<TContext, TContract>): Promisable<RouteHandlerOutput<TContract>>
}

export type RouteHandlerInput<
  TContext extends ServerContext = any,
  TContract extends ContractRoute = any
> = TContract extends ContractRoute<
  infer TMethod,
  infer _TPath,
  infer TParamsSchema,
  infer TQuerySchema,
  infer THeadersSchema,
  infer TBodySchema
>
  ? {
      method: TMethod
      path: HTTPPath
      context: TContext
      params: InferOutput<TParamsSchema>
      query: InferOutput<TQuerySchema>
      headers: InferOutput<THeadersSchema>
      body: InferOutput<TBodySchema>
    }
  : never

export type RouteHandlerOutput<TContract extends ContractRoute = any> =
  TContract extends ContractRoute<any, any, any, any, any, any, infer TResponse>
    ? InferInputResponse<TResponse>
    : never
