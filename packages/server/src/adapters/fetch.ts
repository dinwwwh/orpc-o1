import { HTTPMethod } from '@orpc/contract'
import { RouterHandler } from '../handlers/router'
import { ServerRouterSpecification } from '../specifications/router'

export async function fetchRequestHandler<THandler extends RouterHandler>(opts: {
  request: Request
  handler: THandler
  context: THandler extends RouterHandler<infer TRouter>
    ? TRouter extends ServerRouterSpecification<infer TContext>
      ? TContext
      : never
    : never
  prefix?: string
}): Promise<Response> {
  try {
    const prefix = opts.prefix
      ? opts.prefix.startsWith('/')
        ? opts.prefix
        : '/' + opts.prefix
      : '/'
    const url = new URL(opts.request.url)

    if (!url.pathname.startsWith(prefix)) {
      // TODO: improve error handling
      return new Response('Not Found', { status: 404 })
    }

    const body_text = await opts.request.text()
    const body = body_text ? JSON.parse(body_text) : undefined

    const result = await opts.handler({
      context: opts.context,
      method: opts.request.method as HTTPMethod,
      path: url.pathname.replace(prefix, ''),
      body: body,
      headers: Object.fromEntries(opts.request.headers),
      query: Object.fromEntries(url.searchParams),
    })

    const headers = result.headers ?? {}

    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    })
  } catch {
    return new Response(
      JSON.stringify({
        message: 'Seems like the body is not a valid JSON',
      }),
      {
        status: 400,
      }
    )
  }
}
