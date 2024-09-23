import { IsAny, Merge } from 'type-fest'
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

export type MergeRouteResponses<
  TA extends RouteResponses,
  TB extends RouteResponses
> = IsAny<TA> extends true ? TB : IsAny<TB> extends true ? TA : Merge<TA, TB>
