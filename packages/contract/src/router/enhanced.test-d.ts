import { it } from 'node:test'
import { expectTypeOf } from 'vitest'
import { initORPCContract, Route } from '..'

it('can prefix path', () => {
  const router = initORPCContract
    .router({
      ping: initORPCContract.route({ method: 'GET', path: '/ping' }),
      foo: initORPCContract.router({
        bar: initORPCContract.route({ method: 'GET', path: '/bar' }),
      }),

      // test handle duplicate with prefix method
      prefix: initORPCContract.route({ method: 'GET', path: '/prefix' }),
    })
    .prefix('/api')

  expectTypeOf(router.ping).toEqualTypeOf<Route<'GET', '/api/ping'>>()
  expectTypeOf(router.foo.bar).toEqualTypeOf<Route<'GET', '/api/bar'>>()
  expectTypeOf(router.prefix).toMatchTypeOf<Route<'GET', '/api/prefix'>>()
})
