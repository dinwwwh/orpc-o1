import { initORPCContract } from '@orpc/contract'
import { object, string } from 'valibot'
import { expect, it, vitest } from 'vitest'
import { initORPCServer } from '..'

it('contract resolver chain and no chain is the same', () => {
  const contract = initORPCContract.router({
    ping: initORPCContract.route({
      method: 'GET',
      path: '/ping',
    }),

    users: {
      find: initORPCContract.route({
        method: 'GET',
        path: '/users/{id}',
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

  const orpc = initORPCServer.contract(contract)

  const anyFn = vitest.fn()

  const chainRouter = orpc.router({
    ping: orpc.ping.handler(anyFn),
    users: orpc.users.router({
      find: orpc.users.find.handler(anyFn),
      pets: {
        find: orpc.users.pets.find.handler(anyFn),
      },
    }),
  })

  const router = orpc.router({
    ping: initORPCServer.contract(contract.ping).handler(anyFn),
    users: {
      find: initORPCServer.contract(contract.users.find).handler(anyFn),
      pets: initORPCServer.contract(contract.users.pets).router({
        find: initORPCServer.contract(contract.users.pets.find).handler(anyFn),
      }),
    },
  })

  expect(deeplyDeleteMiddleware(chainRouter)).toEqual(deeplyDeleteMiddleware(router))
})

function deeplyDeleteMiddleware(o: unknown) {
  if (!o) return

  if (typeof o === 'object') {
    if ('middlewares' in o) {
      delete o.middlewares
    }

    for (const key in o) {
      deeplyDeleteMiddleware((o as any)[key])
    }
  }
}
