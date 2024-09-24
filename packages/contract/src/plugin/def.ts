import { RouteResponse } from '../route/types'
import { HTTPStatus } from '../types/http'
import { MergeUnions } from '../types/utils'
import { BodySchema, HeadersSchema } from '../types/validation'

export class ContractPlugin<TResponse extends RouteResponse = any> {
  constructor(
    public __cp: {
      name: string
      responses?: TResponse[]
    }
  ) {}

  response<
    TStatus extends HTTPStatus,
    TBodySchema extends BodySchema,
    THeadersSchema extends HeadersSchema
  >(response: {
    description?: string
    status: TStatus
    body?: TBodySchema
    headers?: THeadersSchema
  }): ContractPlugin<MergeUnions<TResponse, RouteResponse<TStatus, TBodySchema, THeadersSchema>>> {
    this.__cp.responses ??= []
    this.__cp.responses.push(response as any)

    return this as any
  }
}
