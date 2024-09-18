import { IsEqual, Merge } from 'type-fest'
import { HTTPMethod, HTTPPath, HTTPStatus, ValidationSchema } from '../types'

export interface RouteResponse<
  TStatus extends HTTPStatus = HTTPStatus,
  TBodySchema extends ValidationSchema = ValidationSchema,
  THeadersSchema extends ValidationSchema = ValidationSchema
> {
  status: TStatus
  description: string
  body?: TBodySchema
  headers?: THeadersSchema
}

export type RouteResponses = Record<number, RouteResponse>

export class RouteContractSpecification<
  TMethod extends HTTPMethod = HTTPMethod,
  TPath extends HTTPPath = HTTPPath,
  TParamsSchema extends ValidationSchema = ValidationSchema,
  TQuerySchema extends ValidationSchema = ValidationSchema,
  THeadersSchema extends ValidationSchema = ValidationSchema,
  TBodySchema extends ValidationSchema = ValidationSchema,
  TResponses extends RouteResponses = RouteResponses
> {
  public ['🔒']: {
    method: TMethod
    path: TPath
    summary?: string
    description?: string
    ParamsSchema?: TParamsSchema
    QuerySchema?: TQuerySchema
    HeadersSchema?: THeadersSchema
    BodySchema?: TBodySchema
    responses: TResponses
  }

  constructor(opts: { method: TMethod; path: TPath; description?: string; summary?: string }) {
    this['🔒'] = {
      method: opts.method,
      path: opts.path,
      responses: {} as any,
      summary: opts.summary,
      description: opts.description,
    }
  }

  summary(summary: string): this {
    this['🔒'].summary = summary
    return this
  }

  description(description: string): this {
    this['🔒'].description = description
    return this
  }

  params<TSchema extends ValidationSchema>(
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

  query<TSchema extends ValidationSchema>(
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

  headers<TSchema extends ValidationSchema>(
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

  body<TSchema extends ValidationSchema>(
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
    TBody extends ValidationSchema = ValidationSchema,
    THeaders extends ValidationSchema = ValidationSchema
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
    IsEqual<TResponses, RouteResponses> extends true
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
