import { initORPCContract } from '@orpc/contract'
import { number, object, string } from 'valibot'
import { expect, it } from 'vitest'
import { ServerRouteBuilder } from './builder'

it('middleware can modify context', async () => {
  const routeContract = initORPCContract.route({ method: 'GET', path: '/' }).response({
    status: 200,
    body: object({
      you: number(),
    }),
  })

  const handler = new ServerRouteBuilder<{ userId: string }, typeof routeContract>(routeContract)
    .middleware(({ context }) => {
      expect(context).toMatchObject({ userId: 'id' })

      return {
        context: {
          you: 'are',
        },
      }
    })
    .middleware(({ context }) => {
      expect(context).toMatchObject({ you: 'are' })

      return {
        context: {
          you: 123,
        },
      }
    })
    .handler(({ context }) => {
      expect(context).toMatchObject({ you: 123 })

      return {
        status: 200,
        body: {
          you: context.you,
        },
      }
    })

  const result = await handler['🔓'].handler({
    context: { userId: 'id' },
    body: undefined,
    headers: undefined,
    method: 'GET',
    params: undefined,
    path: '/',
    query: undefined,
  })

  expect(result).toEqual({
    status: 200,
    body: {
      you: 123,
    },
  })
})

it('middleware can response right away', async () => {
  const routeContract = initORPCContract.route({ method: 'GET', path: '/' }).response({
    status: 200,
    body: object({
      i: string(),
    }),
  })

  const handler = new ServerRouteBuilder<{ userId: string }, typeof routeContract>(routeContract)
    .middleware(({ context }) => {
      expect(context).toMatchObject({ userId: 'id' })

      return {
        context: {
          you: 'are',
        },
        response: {
          status: 200,
          body: {
            i: 'from middleware',
          },
        },
      }
    })
    .middleware(({ context }) => {
      expect(context).toMatchObject({ you: 'are' })

      return {
        context: {
          you: 123,
        },
      }
    })
    .handler(({ context }) => {
      expect(context).toMatchObject({ you: 123 })

      return {
        status: 200,
        body: {
          i: 'from handler',
        },
      }
    })

  const result = await handler['🔓'].handler({
    context: { userId: 'id' },
    body: undefined,
    headers: undefined,
    method: 'GET',
    params: undefined,
    path: '/',
    query: undefined,
  })

  expect(result).toEqual({
    status: 200,
    body: {
      i: 'from middleware',
    },
  })
})
