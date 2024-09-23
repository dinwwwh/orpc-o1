import { HTTPMethod, isRoute } from '@orpc/contract'
import Router from 'trek-router'
import { Merge } from 'type-fest'
import { isValiError, parseAsync } from 'valibot'
import {
  isServerRouteSpecification,
  ServerRouteHandlerInput,
  ServerRouteSpecification,
} from '../specifications/route'
import { ServerRouterSpecification } from '../specifications/router'
import { convertOpenapiPathToTrekRouterPath } from '../utils'

export interface RouterHandler<TRouter extends ServerRouterSpecification = any> {
  (input: RouterHandlerInput<TRouter>): Promise<RouterHandlerOutput>
}

export type RouterHandlerInput<TRouter extends ServerRouterSpecification = any> = Merge<
  Omit<
    TRouter extends ServerRouterSpecification<infer Context>
      ? ServerRouteHandlerInput<Context>
      : ServerRouteHandlerInput,
    'params'
  >,
  { method: HTTPMethod; path: string }
>

export interface RouterHandlerOutput {
  status: number
  body?: unknown
  headers?: unknown
}

export function createRouterHandler<T extends ServerRouterSpecification>(
  routerSpec: T
): RouterHandler<T> {
  const router = new Router<ServerRouteSpecification>()

  const addToRouterRecursively = (routerSpec: ServerRouterSpecification) => {
    for (const key in routerSpec) {
      const item = routerSpec[key]

      if (isServerRouteSpecification(item)) {
        const contract = item['🔓'].contract

        if (!isRoute(contract)) {
          throw new Error(
            'Contract must be Route, it expected never happened, please report this issue'
          )
        }

        router.add(
          contract['🔒'].method,
          convertOpenapiPathToTrekRouterPath(contract['🔒'].path),
          item
        )
      } else {
        addToRouterRecursively(item as ServerRouterSpecification)
      }
    }
  }

  addToRouterRecursively(routerSpec)

  return async (input) => {
    try {
      const [routeSpec, paramsArr] = router.find(input.method, input.path)

      // TODO: handle separate case 405: Method is not allowed and 501 only: path is not implemented
      if (!routeSpec) {
        return {
          status: 404,
          body: {
            message: 'Not found',
          },
        }
      }

      const internalContract = routeSpec['🔓'].contract['🔒']

      const params: Record<string, string> = {}
      for (const { name, value } of paramsArr) {
        params[name] = value
      }

      const [validParams, validQuery, validHeaders, validBody] = await Promise.all([
        (async () => {
          if (!internalContract.ParamsSchema) return params

          return await parseAsync(internalContract.ParamsSchema, params)
        })(),
        (async () => {
          if (!internalContract.QuerySchema) return input.query

          return await parseAsync(internalContract.QuerySchema, input.query)
        })(),
        (async () => {
          if (!internalContract.HeadersSchema) return input.headers

          return await parseAsync(internalContract.HeadersSchema, input.headers)
        })(),
        (async () => {
          if (!internalContract.BodySchema) return input.body

          return await parseAsync(internalContract.BodySchema, input.body)
        })(),
      ])

      const result = (await routeSpec['🔓'].handler({
        method: input.method,
        path: input.path,
        context: input.context,
        params: validParams,
        query: validQuery,
        headers: validHeaders,
        body: validBody,
      })) as any

      if (typeof result === 'object' && result !== null) {
        return result
      }

      return {
        status: 204,
      }
    } catch (e) {
      // TODO: improve validation error
      if (isValiError(e)) {
        return {
          status: 422,
          body: {
            message: e.message,
          },
        }
      }

      return {
        status: 500,
        body: {
          message: 'Internal server error',
        },
      }
    }
  }
}
