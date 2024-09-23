import { ContractRoute, HTTPPath, OptionalOnUndefined, RouteResponse } from '@orpc/contract'
import { IsAny, Promisable } from 'type-fest'
import { InferInput, InferOutput } from 'valibot'
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
  TContract extends ContractRoute<
    infer _TMethod,
    infer _TPath,
    infer _TParamsSchema,
    infer _TQuerySchema,
    infer _THeadersSchema,
    infer _TBodySchema,
    infer TResponses
  >
    ? IsAny<TResponses> extends true
      ? void
      : {
          [K in keyof TResponses]: TResponses[K] extends RouteResponse<
            infer TStatus,
            infer TBody,
            infer THeaders
          >
            ? OptionalOnUndefined<{
                status: TStatus
                body: InferInput<TBody>
                headers: InferInput<THeaders>
              }>
            : unknown
        }[keyof TResponses]
    : unknown
