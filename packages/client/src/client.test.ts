import { initORPCContract } from '@orpc/contract'
import { initORPCServer } from '@orpc/server'
import { fetchRequestHandler } from '@orpc/server/adapters/fetch'
import { createRouterHandler } from '@orpc/server/handlers/router'
import { object, string } from 'valibot'
import { expect, it } from 'vitest'
import { createORPCClient } from './client'

const contract = initORPCContract.router({
  ping: initORPCContract.route({
    path: '/ping',
    method: 'GET',
  }),
  user: {
    find: initORPCContract
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

    create: initORPCContract
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

const server = initORPCServer.contract(contract).router({
  ping: initORPCServer.contract(contract.ping).handler(() => {}),
  user: {
    find: initORPCServer.contract(contract.user.find).handler(({ params }) => {
      return {
        status: 200,
        body: {
          id: params.id,
          name: 'find:name',
        },
      }
    }),
    create: initORPCServer.contract(contract.user.create).handler(({ body }) => {
      if (body.name === 'error') {
        return {
          status: 400,
          body: {
            message: body.name,
          },
        }
      }

      return {
        status: 201,
        body: {
          id: 'create:id',
          name: body.name,
        },
      }
    }),
  },
})

const routerHandler = createRouterHandler(server)

const client = createORPCClient({
  contract,
  baseURL: 'http://localhost:3000/api',
  fetch: (...args) => {
    return fetchRequestHandler({
      context: undefined,
      request: new Request(...args),
      handler: routerHandler,
      prefix: '/api',
    })
  },
})

it('works', async () => {
  expect(await client.ping.get({})).toMatchObject({
    status: 204,
    body: undefined,
    headers: {},
  })

  const id = crypto.randomUUID()

  expect(await client.user.find.get({ params: { id } })).toMatchObject({
    status: 200,
    body: {
      id,
      name: 'find:name',
    },
    headers: {},
  })

  expect(await client.user.create.post({ body: { name: id } })).toMatchObject({
    status: 201,
    body: {
      id: 'create:id',
      name: id,
    },
    headers: {},
  })

  expect(await client.user.create.post({ body: { name: 'error' } })).toMatchObject({
    status: 400,
    body: {
      message: 'error',
    },
    headers: {},
  })
})
