import { expect, it } from 'vitest'
import { initORPCContract } from '..'

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

  expect(router.ping).toMatchObject({
    ['🔒']: {
      method: 'GET',
      path: '/api/ping',
    },
  })

  expect(router.foo.bar).toMatchObject({
    ['🔒']: {
      method: 'GET',
      path: '/api/bar',
    },
  })

  // AGAIN: prefix is special case
  expect({ ...router.prefix }).toMatchObject({
    ['🔒']: {
      method: 'GET',
      path: '/api/prefix',
    },
  })
})
