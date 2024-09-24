import { HTTPMethod, isContractRoute } from '@orpc/contract'
import TrekRouter from 'trek-router'
import { Merge } from 'type-fest'
import { isValiError, parseAsync } from 'valibot'
import { RouteHandlerInput, ServerRoute } from '../route/def'
import { isServerRoute } from '../route/utils'
import { convertOpenapiPathToTrekRouterPath } from '../utils'
import { ServerRouter } from './def'

export interface ServerRouterHandler<TRouter extends ServerRouter = any> {
  (input: ServerRouterHandlerInput<TRouter>): Promise<ServerRouterHandlerOutput>
}

export type ServerRouterHandlerInput<TRouter extends ServerRouter = any> = Merge<
  Omit<
    TRouter extends ServerRouter<infer Context> ? RouteHandlerInput<Context> : RouteHandlerInput,
    'params'
  >,
  { method: HTTPMethod; path: string }
>

export interface ServerRouterHandlerOutput {
  status: number
  body?: unknown
  headers?: unknown
}

export function createServerRouterHandler<T extends ServerRouter>(
  routerSpec: T
): ServerRouterHandler<T> {
  const router = new TrekRouter<ServerRoute>()

  const addToRouterRecursively = (routerSpec: ServerRouter) => {
    for (const key in routerSpec) {
      const item = routerSpec[key]

      if (isServerRoute(item)) {
        const contract = item['🔓'].contract

        if (!isContractRoute(contract)) {
          throw new Error(
            'Contract must be Route, it expected never happened, please report this issue'
          )
        }

        router.add(
          contract['__cr'].method,
          convertOpenapiPathToTrekRouterPath(contract['__cr'].path),
          item
        )
      } else {
        addToRouterRecursively(item as ServerRouter)
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

      const internalContract = routeSpec['🔓'].contract.__cr

      const params: Record<string, string> = {}
      for (const { name, value } of paramsArr) {
        params[name] = value
      }

      const [validParams, validQuery, validHeaders, validBody] = await Promise.all([
        (async () => {
          if (!internalContract.params?.schema) return params

          return await parseAsync(internalContract.params?.schema, params)
        })(),
        (async () => {
          if (!internalContract.query?.schema) return input.query

          return await parseAsync(internalContract.query?.schema, input.query)
        })(),
        (async () => {
          if (!internalContract.headers?.schema) return input.headers

          return await parseAsync(internalContract.headers?.schema, input.headers)
        })(),
        (async () => {
          if (!internalContract.body?.schema) return input.body

          return await parseAsync(internalContract.body?.schema, input.body)
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
