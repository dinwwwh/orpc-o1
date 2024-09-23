import { object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { Builder } from './builder'
import { Route } from './route'

const builder = new Builder()

it('can build a route', () => {
  const route = builder.route({ method: 'GET', path: '/foo' })

  expectTypeOf(route).toMatchTypeOf<Route<'GET', '/foo'>>()

  expectTypeOf(route).not.toMatchTypeOf({} as Route<'GET', '/fo'>)
  expectTypeOf(route).not.toMatchTypeOf({} as Route<'DELETE', '/foo'>)
})

it('can build a router', () => {
  const router = builder.router({
    foo: builder.route({ method: 'GET', path: '/foo' }),
    bar: builder.route({ method: 'POST', path: '/bar' }),
  })

  expectTypeOf(router).toMatchTypeOf<{
    foo: Route<'GET', '/foo'>
    bar: Route<'POST', '/bar'>
  }>()

  expectTypeOf(router).not.toMatchTypeOf<{
    foo: Route<'GET', '/foo'>
    bar: Route<'GET', '/bar'>
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
    hu: Route<'GET', '/foo'>
    foo: {
      bar: Route<'GET', '/bar'>
    }
  }>()
})

it('can use plugin', () => {
  const builder = new Builder()

  const bodySchema = object({
    message: string(),
  })

  const authPlugin = builder.plugin({ name: 'auth' }).response({
    status: 401,
    body: bodySchema,
  })

  const builder2 = builder.use(authPlugin)

  const route = builder2.route({ method: 'GET', path: '/foo' })

  expectTypeOf(route['🔒'].responses['401']).toMatchTypeOf<{
    status: 401
    body?: typeof bodySchema
  }>()
})