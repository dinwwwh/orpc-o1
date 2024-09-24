import { object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { ContractBuilder } from './builder'
import { ContractRoute } from './route'

const builder = new ContractBuilder()

it('can build a route', () => {
  const route = builder.route({ method: 'GET', path: '/foo' })

  expectTypeOf(route).toMatchTypeOf<ContractRoute<'GET', '/foo'>>()

  expectTypeOf(route).not.toMatchTypeOf({} as ContractRoute<'GET', '/fo'>)
  expectTypeOf(route).not.toMatchTypeOf({} as ContractRoute<'DELETE', '/foo'>)
})

it('can build a router', () => {
  const router = builder.router({
    foo: builder.route({ method: 'GET', path: '/foo' }),
    bar: builder.route({ method: 'POST', path: '/bar' }),
  })

  expectTypeOf(router).toMatchTypeOf<{
    foo: ContractRoute<'GET', '/foo'>
    bar: ContractRoute<'POST', '/bar'>
  }>()

  expectTypeOf(router).not.toMatchTypeOf<{
    foo: ContractRoute<'GET', '/foo'>
    bar: ContractRoute<'GET', '/bar'>
  }>()
})

it('can build nested routers', () => {
  const router = builder.router({
    hu: builder.route({ method: 'GET', path: '/foo' }),

    foo: builder.router({
      bar: builder.route({ method: 'GET', path: '/bar' }),
    }),
  })

  expectTypeOf(router).toMatchTypeOf<{
    hu: ContractRoute<'GET', '/foo'>
    foo: {
      bar: ContractRoute<'GET', '/bar'>
    }
  }>()
})

it('can use plugin', () => {
  const builder = new ContractBuilder()

  const bodySchema = object({
    message: string(),
  })

  const authPlugin = builder.plugin({ name: 'auth' }).response({
    status: 401,
    body: bodySchema,
  })

  const builder2 = builder.use(authPlugin)

  const headerSchema = object({
    token: string(),
  })

  const route = builder2
    .route({ method: 'GET', path: '/foo' })
    .response({
      status: 401,
      headers: headerSchema,
    })
    .response({
      status: 402,
      body: bodySchema,
      headers: headerSchema,
    })

  expectTypeOf(route['__cr'].responses).toMatchTypeOf<
    | (
        | {
            status: 401
            body?: typeof bodySchema
          }
        | {
            status: 401
            headers?: typeof headerSchema
          }
        | {
            status: 402
            body?: typeof bodySchema
            headers?: typeof headerSchema
          }
      )[]
    | undefined
  >()
})
