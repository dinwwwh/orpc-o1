import { isRoute, OptionalOnUndefined, Route, Router, RouteResponse } from '@orpc/contract'
import { IsAny } from 'type-fest'
import type { InferInput } from 'valibot'

export function createORPCClient<TContract extends Router>(opts: {
  contract: TContract
  baseURL: string
  fetch?: typeof fetch
}): ORPCClient<TContract> {
  const createProxy = (contract: Route | TContract) => {
    return new Proxy(contract as object, {
      get(target, prop) {
        const contract = Reflect.get(target, prop)

        if (contract === undefined) return undefined

        if (isRoute(contract)) {
          const internal = contract['🔒'] as Route['🔒']
          return async (input: ORPCRouteClientInput): Promise<ORPCRouteClientOutput> => {
            let contractPath = internal.path.startsWith('/') ? '.' + internal.path : internal.path

            if (input.params && typeof input.params === 'object' && input.params !== null) {
              for (const key in input.params) {
                const item = (input.params as Record<string, any>)[key]

                if (
                  typeof item !== 'string' &&
                  typeof item !== 'number' &&
                  typeof item !== 'boolean'
                ) {
                  throw new Error('param items must be string or number')
                }

                contractPath = contractPath.replace(`{${key}}`, encodeURIComponent(item))
              }
            }

            const url = new URL(
              contractPath,
              opts.baseURL.endsWith('/') ? opts.baseURL : opts.baseURL + '/'
            )

            if (input.query && typeof input.query === 'object' && input.query !== null) {
              for (const key in input.query) {
                const item = (input.query as Record<string, any>)[key]

                if (typeof item !== 'string') {
                  throw new Error('query items must be string or number')
                }

                url.searchParams.append(key, item)
              }
            }

            const response = await (opts.fetch ?? fetch)(url, {
              method: internal.method,
              headers: {
                ...(input.headers as any),
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input.body),
            })

            const text = await response.text()
            const json = text ? JSON.parse(text) : undefined

            return {
              status: response.status,
              body: json,
              headers: Object.fromEntries(response.headers.entries()),
            } as any
          }
        }

        return createProxy(contract)
      },
    }) as any
  }

  return createProxy(opts.contract)
}

export type ORPCClient<TContract extends Router = Router> = {
  [K in keyof TContract]: TContract[K] extends Route
    ? ORPCRouteClient<TContract[K]>
    : ORPCClient<TContract[K]>
}

export type ORPCRouteClient<TContract extends Route = Route> = {
  (input: ORPCRouteClientInput<TContract>): Promise<ORPCRouteClientOutput<TContract>>
}

export type ORPCRouteClientInput<TContract extends Route = Route> = TContract extends Route<
  infer _TMethod,
  infer _TPath,
  infer TParamsSchema,
  infer TQuerySchema,
  infer THeadersSchema,
  infer TBodySchema
>
  ? OptionalOnUndefined<{
      params: InferInput<TParamsSchema>
      query: InferInput<TQuerySchema>
      headers: InferInput<THeadersSchema>
      body: InferInput<TBodySchema>
    }>
  : unknown

export type ORPCRouteClientOutput<TContract extends Route = Route> = TContract extends Route<
  infer _TMethod,
  infer _TPath,
  infer _TParamsSchema,
  infer _TQuerySchema,
  infer _THeadersSchema,
  infer _TBodySchema,
  infer TResponses
>
  ? IsAny<TResponses> extends false
    ? {
        [K in keyof TResponses]: TResponses[K] extends RouteResponse<
          infer TStatus,
          infer TBody,
          infer THeaders
        >
          ? {
              status: TStatus
              body: InferInput<TBody>
              headers: InferInput<THeaders>
            }
          : unknown
      }[keyof TResponses]
    : {
        status: 204
        body: undefined
        headers: Record<string, never>
      }
  : unknown
