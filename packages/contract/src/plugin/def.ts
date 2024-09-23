import { IsAny, Merge } from 'type-fest'
import { RouteResponse, RouteResponses } from '../route/types'
import { HTTPStatus } from '../types/http'
import { BodySchema, HeadersSchema } from '../types/validation'

export class Plugin<TResponses extends RouteResponses = any> {
  public ['🔒']: {
    name: string
    responses: TResponses
  }

  constructor(opts: { name: string }) {
    this['🔒'] = {
      responses: {} as any,
      ...opts,
    }
  }

  response<
    TStatus extends HTTPStatus,
    TBodySchema extends BodySchema,
    THeadersSchema extends HeadersSchema
  >(response: {
    description?: string
    status: TStatus
    body?: TBodySchema
    headers?: THeadersSchema
  }): Plugin<
    IsAny<TResponses> extends true
      ? { [K in TStatus]: RouteResponse<TStatus, TBodySchema, THeadersSchema> }
      : Merge<TResponses, { [K in TStatus]: RouteResponse<TStatus, TBodySchema, THeadersSchema> }>
  > {
    this['🔒'].responses[response.status] = response

    return this as any
  }
}
