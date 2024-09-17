import { RouteContractSpecification } from '@orpc/contract/__internal__/specifications/route'
import { ServerRouteHandlerInput, ServerRouteSpecification } from 'src/specifications/route'
import { ServerRouterSpecification } from 'src/specifications/router'
import { convertOpenapiPathToTrekRouterPath } from 'src/utils'
import Router from 'trek-router'
import { isValiError, parseAsync } from 'valibot'

export interface RouterHandler<
  TRouter extends ServerRouterSpecification = ServerRouterSpecification
> {
  (input: RouterHandlerInput<TRouter>): Promise<RouterHandlerOutput>
}

export type RouterHandlerInput<
  TRouter extends ServerRouterSpecification = ServerRouterSpecification
> = Omit<
  TRouter extends ServerRouterSpecification<infer Context>
    ? ServerRouteHandlerInput<Context>
    : ServerRouteHandlerInput,
  'params'
> & { method: string; path: string }

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

      if (item instanceof ServerRouteSpecification) {
        const contract = item.__internal__.contract

        if (!(contract instanceof RouteContractSpecification)) {
          throw new Error(
            'Contract must be RouteContractSpecification, it expected never happened, please report this issue'
          )
        }

        router.add(
          contract.__internal__.method,
          convertOpenapiPathToTrekRouterPath(contract.__internal__.path),
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

      const internalContract = routeSpec.__internal__.contract.__internal__

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

      const result = (await routeSpec.__internal__.handler({
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