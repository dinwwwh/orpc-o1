import { it } from 'node:test'
import { expectTypeOf } from 'vitest'
import { ContractRoute, initORPCContract } from '..'

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

  expectTypeOf(router.ping).toEqualTypeOf<ContractRoute<'GET', '/api/ping'>>()
  expectTypeOf(router.foo.bar).toEqualTypeOf<ContractRoute<'GET', '/api/bar'>>()
  expectTypeOf(router.prefix).toMatchTypeOf<ContractRoute<'GET', '/api/prefix'>>()
})
