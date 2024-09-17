import {
  RouteContractSpecification,
  RouteResponse,
  RouteResponses,
} from '@orpc/contract/__internal__/specifications/route'
import { ValidationSchema } from '@orpc/contract/__internal__/types'
import { OptionalOnUndefined, ServerContext } from 'src/types'
import { IsEqual, Promisable } from 'type-fest'
import { InferInput, InferOutput } from 'valibot'

export class ServerRouteSpecification<
  TContext extends ServerContext = ServerContext,
  TContract extends RouteContractSpecification = RouteContractSpecification
> {
  public __internal__: {
    contract: TContract
    handler: ServerRouteHandler<TContext, TContract>
  }

  constructor(opts: { contract: TContract; handler: ServerRouteHandler<TContext, TContract> }) {
    this.__internal__ = {
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
  infer TPath,
  infer TParamsSchema,
  infer TQuerySchema,
  infer THeadersSchema,
  infer TBodySchema
>
  ? OptionalOnUndefined<{
      method: TMethod
      path: TPath
      context: TContext
      params: IsEqual<TParamsSchema, ValidationSchema> extends true
        ? unknown
        : InferOutput<TParamsSchema>
      query: IsEqual<TQuerySchema, ValidationSchema> extends true
        ? unknown
        : InferOutput<TQuerySchema>
      headers: IsEqual<THeadersSchema, ValidationSchema> extends true
        ? unknown
        : InferOutput<THeadersSchema>
      body: IsEqual<TBodySchema, ValidationSchema> extends true ? unknown : InferOutput<TBodySchema>
    }>
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
  ? IsEqual<TResponses, RouteResponses> extends true
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
