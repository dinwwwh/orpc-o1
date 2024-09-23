import { Plugin } from '../plugin'
import {
  HTTPMethod,
  HTTPPath,
  HTTPStatus,
  MergeHTTPPaths,
  StandardizeHTTPPath,
} from '../types/http'
import { BodySchema, HeadersSchema, ParamsSchema, QuerySchema } from '../types/validation'
import { mergeHTTPPaths } from '../utils/http'
import { MergeRouteResponses, RouteResponse, RouteResponses } from './types'

export class Route<
  TMethod extends HTTPMethod = any,
  TPath extends HTTPPath = any,
  TParamsSchema extends ParamsSchema = any,
  TQuerySchema extends QuerySchema = any,
  THeadersSchema extends HeadersSchema = any,
  TBodySchema extends BodySchema = any,
  TResponses extends RouteResponses = any
> {
  public ['🔒']: {
    method: TMethod
    path: TPath
    summary?: string
    description?: string
    deprecated?: boolean
    params: {
      schema?: TParamsSchema
    }
    query: {
      schema?: TQuerySchema
    }
    headers: {
      schema?: THeadersSchema
    }
    body: {
      schema?: TBodySchema
    }
    responses: TResponses
  }

  constructor(opts: {
    method: TMethod
    path: TPath
    summary?: string
    description?: string
    deprecated?: boolean
  }) {
    this['🔒'] = {
      params: {},
      query: {},
      headers: {},
      body: {},
      responses: {} as any,
      ...opts,
    }
  }

  prefix<TPrefix extends HTTPPath>(
    prefix: TPrefix
  ): Route<
    TMethod,
    MergeHTTPPaths<StandardizeHTTPPath<TPrefix>, TPath>,
    TParamsSchema,
    TQuerySchema,
    THeadersSchema,
    TBodySchema,
    TResponses
  > {
    this['🔒'].path = mergeHTTPPaths(prefix, this['🔒'].path) as any
    return this as any
  }

  summary(summary: string): this {
    this['🔒'].summary = summary
    return this
  }

  description(description: string): this {
    this['🔒'].description = description
    return this
  }

  deprecated(deprecated: boolean): this {
    this['🔒'].deprecated = deprecated
    return this
  }

  params<TSchema extends ParamsSchema>(
    schema: TSchema
  ): Route<TMethod, TPath, TSchema, TQuerySchema, THeadersSchema, TBodySchema, TResponses> {
    this['🔒'].params.schema = schema as any
    return this as any
  }

  query<TSchema extends QuerySchema>(
    schema: TSchema
  ): Route<TMethod, TPath, TParamsSchema, TSchema, THeadersSchema, TBodySchema, TResponses> {
    this['🔒'].query.schema = schema as any
    return this as any
  }

  headers<TSchema extends HeadersSchema>(
    schema: TSchema
  ): Route<TMethod, TPath, TParamsSchema, TQuerySchema, TSchema, TBodySchema, TResponses> {
    this['🔒'].headers.schema = schema as any
    return this as any
  }

  body<TSchema extends BodySchema>(
    schema: TSchema
  ): Route<TMethod, TPath, TParamsSchema, TQuerySchema, THeadersSchema, TSchema, TResponses> {
    this['🔒'].body.schema = schema as any
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
  }): Route<
    TMethod,
    TPath,
    TParamsSchema,
    TQuerySchema,
    THeadersSchema,
    TBodySchema,
    MergeRouteResponses<TResponses, { [K in TStatus]: RouteResponse<TStatus, TBody, THeaders> }>
  > {
    this['🔒'].responses[response.status] = response

    return this as any
  }

  use<T extends Plugin>(
    plugin: T
  ): Route<
    TMethod,
    TPath,
    TParamsSchema,
    TQuerySchema,
    THeadersSchema,
    TBodySchema,
    T extends Plugin<infer T2Responses> ? MergeRouteResponses<TResponses, T2Responses> : never
  > {
    const responses = plugin['🔒'].responses

    for (const key in responses) {
      ;(this['🔒'].responses as any)[key] = responses[key]
    }

    return this as any
  }
}
