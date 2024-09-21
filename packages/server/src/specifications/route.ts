import {
  HTTPPath,
  OptionalOnUndefined,
  RouteContractSpecification,
  RouteResponse,
} from '@orpc/contract'
import { IsAny, Promisable } from 'type-fest'
import { InferInput, InferOutput } from 'valibot'
import { ServerContext } from '../types'

export class ServerRouteSpecification<
  TContext extends ServerContext = ServerContext,
  TContract extends RouteContractSpecification = RouteContractSpecification
> {
  public ['🔓']: {
    contract: TContract
    handler: ServerRouteHandler<TContext, TContract>
  }

  constructor(opts: { contract: TContract; handler: ServerRouteHandler<TContext, TContract> }) {
    this['🔓'] = {
      contract: opts.contract,
      handler: opts.handler,
    }
  }
}

export interface ServerRouteHandler<
  TContext extends ServerContext = ServerContext,
  TContract extends RouteContractSpecification = RouteContractSpecification
> {
  (input: ServerRouteHandlerInput<TContext, TContract>): Promisable<
    ServerRouteHandlerOutput<TContract>
  >
}

export type ServerRouteHandlerInput<
  TContext extends ServerContext = ServerContext,
  TContract extends RouteContractSpecification = RouteContractSpecification
> = TContract extends RouteContractSpecification<
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
  : unknown

export type ServerRouteHandlerOutput<
  TContract extends RouteContractSpecification = RouteContractSpecification
> = TContract extends RouteContractSpecification<
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

export function isServerRouteSpecification(value: unknown): value is ServerRouteSpecification {
  if (value instanceof ServerRouteSpecification) return true

  // TODO: should has a schema validation here
  return false
}
