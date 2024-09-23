import { HTTPStatus } from '../types/http'
import { BodySchema, HeadersSchema } from '../types/validation'

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

export type RouteResponses = Partial<Record<HTTPStatus, RouteResponse>>
