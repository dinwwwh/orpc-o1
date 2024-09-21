import { IsAny, Merge } from 'type-fest'
import { is, object, string } from 'valibot'
import {
  HTTPMethod,
  HTTPPath,
  HTTPStatus,
  MergeHTTPPaths,
  StandardizeHTTPPath,
} from '../types/http'
import { BodySchema, HeadersSchema, ParamsSchema, QuerySchema } from '../types/validation'
import { mergeHTTPPaths } from '../utils/http'

export interface RouteResponse<
  TStatus extends HTTPStatus = any,
  TBodySchema extends BodySchema = any,
  THeadersSchema extends HeadersSchema = any
> {
  status: TStatus
  description: string
  body?: TBodySchema
  headers?: THeadersSchema
}

export type RouteResponses = Partial<Record<HTTPStatus, RouteResponse>>

export class RouteContractSpecification<
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
    ParamsSchema?: TParamsSchema
    QuerySchema?: TQuerySchema
    HeadersSchema?: THeadersSchema
    BodySchema?: TBodySchema
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
      method: opts.method,
      path: opts.path,
      responses: {} as any,
      summary: opts.summary,
      description: opts.description,
      deprecated: opts.deprecated,
    }
  }

  prefix<TPrefix extends HTTPPath>(
    prefix: TPrefix
  ): RouteContractSpecification<
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
  ): RouteContractSpecification<
    TMethod,
    TPath,
    TSchema,
    TQuerySchema,
    THeadersSchema,
    TBodySchema,
    TResponses
  > {
    this['🔒'].ParamsSchema = schema as any
    return this as any
  }

  query<TSchema extends QuerySchema>(
    schema: TSchema
  ): RouteContractSpecification<
    TMethod,
    TPath,
    TParamsSchema,
    TSchema,
    THeadersSchema,
    TBodySchema,
    TResponses
  > {
    this['🔒'].QuerySchema = schema as any
    return this as any
  }

  headers<TSchema extends HeadersSchema>(
    schema: TSchema
  ): RouteContractSpecification<
    TMethod,
    TPath,
    TParamsSchema,
    TQuerySchema,
    TSchema,
    TBodySchema,
    TResponses
  > {
    this['🔒'].HeadersSchema = schema as any
    return this as any
  }

  body<TSchema extends BodySchema>(
    schema: TSchema
  ): RouteContractSpecification<
    TMethod,
    TPath,
    TParamsSchema,
    TQuerySchema,
    THeadersSchema,
    TSchema,
    TResponses
  > {
    this['🔒'].BodySchema = schema as any
    return this as any
  }

  response<
    TStatus extends HTTPStatus,
    TBody extends BodySchema = any,
    THeaders extends HeadersSchema = any
  >(opts: {
    description?: string
    status: TStatus
    body?: TBody
    headers?: THeaders
  }): RouteContractSpecification<
    TMethod,
    TPath,
    TParamsSchema,
    TQuerySchema,
    THeadersSchema,
    TBodySchema,
    IsAny<TResponses> extends true
      ? { [K in TStatus]: RouteResponse<TStatus, TBody, THeaders> }
      : Merge<TResponses, { [K in TStatus]: RouteResponse<TStatus, TBody, THeaders> }>
  > {
    this['🔒'].responses[opts.status] = {
      status: opts.status,
      description: opts.description ?? String(opts.status),
      body: opts.body,
      headers: opts.headers,
    }

    return this as any
  }
}

export function isRouteContractSpecification(value: unknown): value is RouteContractSpecification {
  if (value instanceof RouteContractSpecification) return true

  try {
    return is(
      object({
        method: string(),
        path: string(),
      }),
      (value as any)?.['🔒']
    )
  } catch {
    return false
  }
}
