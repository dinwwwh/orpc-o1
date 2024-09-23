import { expect, it } from 'vitest'
import { initORPCServer } from '..'
import { userRouterContract } from '../__tests__/contract'
import { createRouterHandler } from '../router'
import { fetchRequestHandler } from './fetch'

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

const prefixes = ['/api/', '/api', '/', undefined, '/hehe//', '//huhu', '/hu/hu//']

it.each(prefixes)('can handle not found: %s', async (prefix) => {
  const request = new Request(`http://dinwwwh.com${prefix}/not-found`)

  const response = await fetchRequestHandler({
    request,
    context: context,
    handler: routeHandler,
    prefix,
  })

  expect(response.status).toBe(404)
})

it.each(prefixes)('can find user: %s', async (prefix) => {
  const id = crypto.randomUUID()

  const request = new Request(`http://dinwwwh.com${prefix}/users/` + id)

  const response = await fetchRequestHandler({
    request,
    context: context,
    handler: routeHandler,
    prefix,
  })

  expect(response.status).toBe(200)

  const result = await response.json()

  expect(result).toMatchObject({
    id,
  })
})

it.each(prefixes)('can create user: %s', async (prefix) => {
  const name = crypto.randomUUID()

  const request = new Request(`http://dinwwwh.com${prefix}/users`, {
    method: 'POST',
    body: JSON.stringify({
      name: name,
    }),
  })

  const response = await fetchRequestHandler({
    request,
    context: context,
    handler: routeHandler,
    prefix,
  })

  expect(response.status).toBe(201)

  const result = await response.json()

  expect(result).toMatchObject({
    name,
  })
})
