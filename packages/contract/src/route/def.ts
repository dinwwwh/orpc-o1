import { ContractPlugin } from '../plugin'
import { contractRouteUsePlugin, ContractRouteUsePlugin } from '../plugin/route'
import {
  HTTPMethod,
  HTTPPath,
  HTTPStatus,
  MergeHTTPPaths,
  StandardizeHTTPPath,
} from '../types/http'
import { MergeUnions } from '../types/utils'
import { BodySchema, HeadersSchema, ParamsSchema, QuerySchema } from '../types/validation'
import { mergeHTTPPaths } from '../utils/http'
import { RouteResponse } from './types'

export class ContractRoute<
  TMethod extends HTTPMethod = any,
  TPath extends HTTPPath = any,
  TParamsSchema extends ParamsSchema = any,
  TQuerySchema extends QuerySchema = any,
  THeadersSchema extends HeadersSchema = any,
  TBodySchema extends BodySchema = any,
  TResponse extends RouteResponse = any
> {
  constructor(
    public __cr: {
      method: TMethod
      path: TPath
      summary?: string
      description?: string
      deprecated?: boolean
      params?: {
        schema?: TParamsSchema
      }
      query?: {
        schema?: TQuerySchema
      }
      headers?: {
        schema?: THeadersSchema
      }
      body?: {
        schema?: TBodySchema
      }
      responses?: TResponse[]
    }
  ) {}

  prefix<TPrefix extends HTTPPath>(
    prefix: TPrefix
  ): ContractRoute<
    TMethod,
    MergeHTTPPaths<StandardizeHTTPPath<TPrefix>, TPath>,
    TParamsSchema,
    TQuerySchema,
    THeadersSchema,
    TBodySchema,
    TResponse
  > {
    this.__cr.path = mergeHTTPPaths(prefix, this.__cr.path) as any
    return this as any
  }

  summary(summary: string): this {
    this.__cr.summary = summary
    return this
  }

  description(description: string): this {
    this.__cr.description = description
    return this
  }

  deprecated(deprecated: boolean): this {
    this.__cr.deprecated = deprecated
    return this
  }

  params<TSchema extends ParamsSchema>(
    schema: TSchema
  ): ContractRoute<TMethod, TPath, TSchema, TQuerySchema, THeadersSchema, TBodySchema, TResponse> {
    this.__cr.params ??= {}
    this.__cr.params.schema = schema as any
    return this as any
  }

  query<TSchema extends QuerySchema>(
    schema: TSchema
  ): ContractRoute<TMethod, TPath, TParamsSchema, TSchema, THeadersSchema, TBodySchema, TResponse> {
    this.__cr.query ??= {}
    this.__cr.query.schema = schema as any
    return this as any
  }

  headers<TSchema extends HeadersSchema>(
    schema: TSchema
  ): ContractRoute<TMethod, TPath, TParamsSchema, TQuerySchema, TSchema, TBodySchema, TResponse> {
    this.__cr.headers ??= {}
    this.__cr.headers.schema = schema as any
    return this as any
  }

  body<TSchema extends BodySchema>(
    schema: TSchema
  ): ContractRoute<
    TMethod,
    TPath,
    TParamsSchema,
    TQuerySchema,
    THeadersSchema,
    TSchema,
    TResponse
  > {
    this.__cr.body ??= {}
    this.__cr.body.schema = schema as any
    return this as any
  }

  response<
    TStatus extends HTTPStatus,
    TBody extends BodySchema = any,
    THeaders extends HeadersSchema = any
  >(response: {
    description?: string
    status: TStatus
    body?: TBody
    headers?: THeaders
  }): ContractRoute<
    TMethod,
    TPath,
    TParamsSchema,
    TQuerySchema,
    THeadersSchema,
    TBodySchema,
    MergeUnions<TResponse, RouteResponse<TStatus, TBody, THeaders>>
  > {
    this.__cr.responses ??= []
    this.__cr.responses.push(response as any)

    return this as any
  }

  use<T extends ContractPlugin>(plugin: T): ContractRouteUsePlugin<this, T> {
    return contractRouteUsePlugin(this, [plugin])
  }
}
