import { initORPCContract } from '@orpc/contract'
import { object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { initORPCServer } from '..'
import { findUserContract, findUserRouterContract } from '../__tests__/contract'
import { ServerBuilder } from './server'

it('works with context', () => {
  const server1 = new ServerBuilder()
  expectTypeOf<typeof server1 extends ServerBuilder<infer T> ? T : never>().toEqualTypeOf<any>()

  const server2 = new ServerBuilder<unknown>()
  expectTypeOf<typeof server2 extends ServerBuilder<infer T> ? T : never>().toEqualTypeOf<unknown>()

  const server3 = new ServerBuilder<{ userId: string }>()
  expectTypeOf<typeof server3 extends ServerBuilder<infer T> ? T : never>().toEqualTypeOf<{
    userId: string
  }>()
})

it('can override context', () => {
  const server = new ServerBuilder<{ userId: string }>()

  expectTypeOf<typeof server extends ServerBuilder<infer T> ? T : never>().toEqualTypeOf<{
    userId: string
  }>()

  const server2 = server.context<{ userId: number }>()

  expectTypeOf<typeof server2 extends ServerBuilder<infer T> ? T : never>().toEqualTypeOf<{
    userId: number
  }>()
})

it('can handle contract', () => {
  const server = new ServerBuilder()

  server.contract(findUserRouterContract).router({
    find: server.contract(findUserContract).handler('' as any),
  })

  server.contract(findUserRouterContract).router({
    // @ts-expect-error find must match
    find: server.contract(findUserContract),
  })
})

it('can chain on contract implement', () => {
  const orpc = initORPCServer.contract(
    initORPCContract.router({
      ping: initORPCContract.route({
        method: 'GET',
        path: '/ping',
      }),

      users: {
        find: initORPCContract.route({
          method: 'GET',
          path: '/users/{id}',
        }),
        create: initORPCContract.route({
          method: 'POST',
          path: '/users',
        }),

        pets: {
          find: initORPCContract
            .route({
              method: 'GET',
              path: '/pets/{id}',
            })
            .params(
              object({
                id: string(),
              })
            ),
        },
      },
    })
  )

  orpc.router({
    ping: orpc.ping.handler('' as any),
    users: orpc.users.router({
      find: orpc.users.find.handler('' as any),
      create: orpc.users.create.handler('' as any),
      pets: {
        find: orpc.users.pets.find.handler(({ params }) => {
          expectTypeOf(params).toEqualTypeOf<{ id: string }>()

          return '' as any
        }),
      },
    }),
  })
})
