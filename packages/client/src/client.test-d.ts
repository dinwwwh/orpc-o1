import { initORPCContract } from '@orpc/contract'
import { object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { createORPCClient } from './client'

const orpc = initORPCContract

const contract = orpc.router({
  ping: orpc.route({
    path: '/ping',
    method: 'GET',
  }),
  user: {
    find: orpc
      .route({
        path: '/user/{id}',
        method: 'GET',
      })
      .params(object({ id: string() }))
      .response({
        status: 200,
        body: object({
          id: string(),
          name: string(),
        }),
      }),

    create: orpc
      .route({
        path: '/user',
        method: 'POST',
      })
      .body(
        object({
          name: string(),
        })
      )
      .response({
        status: 201,
        body: object({
          id: string(),
          name: string(),
        }),
      })
      .response({
        status: 400,
        body: object({
          message: string(),
        }),
      }),
  },
})

const client = createORPCClient({
  contract,
  baseURL: 'http://localhost:3000',
})

it('works', () => {
  expectTypeOf(client.ping.get).toEqualTypeOf<
    (input: { params?: unknown; query?: unknown; headers?: unknown; body?: unknown }) => Promise<{
      status: 204
      body: undefined
      headers: Record<string, never>
    }>
  >()

  expectTypeOf(client.user.find.get).toEqualTypeOf<
    (input: {
      params: { id: string }
      query?: unknown
      headers?: unknown
      body?: unknown
    }) => Promise<{
      status: 200
      body: {
        id: string
        name: string
      }
      headers: unknown
    }>
  >()

  expectTypeOf(client.user.create.post).toEqualTypeOf<
    (input: {
      params?: unknown
      query?: unknown
      headers?: unknown
      body: {
        name: string
      }
    }) => Promise<
      | {
          status: 201
          body: {
            id: string
            name: string
          }
          headers: unknown
        }
      | {
          status: 400
          body: {
            message: string
          }
          headers: unknown
        }
    >
  >()
})
