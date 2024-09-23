import { expect, it } from 'vitest'
import { initORPCServer } from '..'
import { userRouterContract } from '../__tests__/contract'
import { createRouterHandler } from './handler'

const orpc = initORPCServer.context<{ auth?: { id: string } }>()

const context = {
  auth: {
    id: 'auth-id',
  },
}

const appRouter = orpc.contract(userRouterContract).router({
  find: orpc.contract(userRouterContract.find).handler(async ({ params }) => {
    return {
      status: 200,
      body: {
        id: params.id,
        name: 'name',
      },
    }
  }),
  create: orpc.contract(userRouterContract.create).handler(async ({ body }) => {
    return {
      status: 201,
      body: {
        id: 'new-id',
        name: body.name,
      },
    }
  }),
})

const routeHandler = createRouterHandler(appRouter)

it('can handle not found', { repeats: 5 }, async () => {
  const result = await routeHandler({
    path: '/not-found',
    method: 'GET',
    context,
    body: undefined,
    headers: {},
    query: {},
  })

  expect(result).toMatchObject({
    status: 404,
    body: {
      message: 'Not found',
    },
  })
})

it('can find a user', { repeats: 5 }, async () => {
  const id = crypto.randomUUID()

  const result = await routeHandler({
    path: '/users/' + id,
    method: 'GET',
    context: context,
    body: undefined,
    headers: {},
    query: {},
  })

  expect(result).toMatchObject({
    status: 200,
    body: {
      id,
    },
  })
})

it('can create a user', { repeats: 5 }, async () => {
  const name = crypto.randomUUID()

  const result = await routeHandler({
    path: '/users',
    method: 'POST',
    context,
    body: {
      name: name,
    },
    headers: {},
    query: {},
  })

  expect(result).toMatchObject({
    status: 201,
    body: {
      name,
    },
  })
})
