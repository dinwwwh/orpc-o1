import { expectTypeOf, it } from 'vitest'
import { RouteContractSpecification } from '../specifications/route'
import { ContractBuilder } from './contract'

const builder = new ContractBuilder()

it('can build a route', () => {
  const route = builder.route({ method: 'GET', path: '/foo' })

  expectTypeOf(route).toMatchTypeOf<RouteContractSpecification<'GET', '/foo'>>()

  expectTypeOf(route).not.toMatchTypeOf({} as RouteContractSpecification<'GET', '/fo'>)
  expectTypeOf(route).not.toMatchTypeOf({} as RouteContractSpecification<'DELETE', '/foo'>)
})

it('can build a router', () => {
  const router = builder.router({
    foo: builder.route({ method: 'GET', path: '/foo' }),
    bar: builder.route({ method: 'POST', path: '/bar' }),
  })

  expectTypeOf(router).toMatchTypeOf<{
    foo: RouteContractSpecification<'GET', '/foo'>
    bar: RouteContractSpecification<'POST', '/bar'>
  }>()

  expectTypeOf(router).not.toMatchTypeOf(
    {} as {
      foo: RouteContractSpecification<'GET', '/foo'>
      bar: RouteContractSpecification<'GET', '/bar'>
    }
  )
})

it('can build nested routers', () => {
  const router = builder.router({
    hu: builder.route({ method: 'GET', path: '/foo' }),

    foo: builder.router({
      bar: builder.route({ method: 'GET', path: '/bar' }),
    }),
  })

  expectTypeOf(router).toMatchTypeOf<{
    hu: RouteContractSpecification<'GET', '/foo'>
    foo: {
      bar: RouteContractSpecification<'GET', '/bar'>
    }
  }>()
})
