import { IsAny } from 'type-fest'
import { HTTPStatus } from '../types/http'
import { OptionalOnUndefined } from '../types/utils'
import { BodySchema, HeadersSchema, InferInput, InferOutput } from '../types/validation'

export interface RouteResponse<
  TStatus extends HTTPStatus = any,
  TBodySchema extends BodySchema = any,
  THeadersSchema extends HeadersSchema = any
> {
  status: TStatus
  description?: string
  body?: TBodySchema
  headers?: THeadersSchema
}

export type InferInputResponse<TResponse extends RouteResponse> = IsAny<TResponse> extends true
  ? void
  : TResponse extends RouteResponse<infer TStatus, infer TBody, infer THeaders>
  ? OptionalOnUndefined<{
      status: TStatus
      body: InferInput<TBody>
      headers: InferInput<THeaders>
    }>
  : never

export type InferOutputResponse<TResponse extends RouteResponse> = IsAny<TResponse> extends true
  ? { status: 204 }
  : TResponse extends RouteResponse<infer TStatus, infer TBody, infer THeaders>
  ? {
      status: TStatus
      body: InferOutput<TBody>
      headers: InferOutput<THeaders>
    }
  : never
