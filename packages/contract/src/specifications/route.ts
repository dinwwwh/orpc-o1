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
  public __internal__: {
    method: TMethod
    path: TPath
    description?: string
    ParamsSchema?: TParamsSchema
    QuerySchema?: TQuerySchema
    HeadersSchema?: THeadersSchema
    BodySchema?: TBodySchema
    responses: TResponses
  }

  constructor(opts: { method: TMethod; path: TPath }) {
    this.__internal__ = {
      method: opts.method,
      path: opts.path,
      responses: {} as any,
    }
  }

  description(description: string): this {
    this.__internal__.description = description
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
    this.__internal__.ParamsSchema = schema as any
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
    this.__internal__.QuerySchema = schema as any
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
    this.__internal__.HeadersSchema = schema as any
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
    this.__internal__.BodySchema = schema as any
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
    this.__internal__.responses[opts.status] = {
      status: opts.status,
      description: opts.description ?? String(opts.status),
      body: opts.body,
      headers: opts.headers,
    }

    return this as any
  }
}
