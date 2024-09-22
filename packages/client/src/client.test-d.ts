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
  expectTypeOf(client.ping).toEqualTypeOf<
    (input: { params?: any; query?: any; headers?: any; body?: any }) => Promise<{
      status: 204
      body: undefined
      headers: Record<string, never>
    }>
  >()

  expectTypeOf(client.user.find).toEqualTypeOf<
    (input: { params: { id: string }; query?: any; headers?: any; body?: any }) => Promise<{
      status: 200
      body: {
        id: string
        name: string
      }
      headers: any
    }>
  >()

  expectTypeOf(client.user.create).toEqualTypeOf<
    (input: {
      params?: any
      query?: any
      headers?: any
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
          headers: any
        }
      | {
          status: 400
          body: {
            message: string
          }
          headers: any
        }
    >
  >()
})
