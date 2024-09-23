import { object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { Plugin } from '../plugin'
import { Route } from './def'

const authBodySchema = object({
  message: string(),
})

const authHeaderSchema = object({
  token: string(),
})

const authPlugin = new Plugin({ name: 'auth' }).response({
  status: 401,
  body: authBodySchema,
  headers: authHeaderSchema,
})

it('can use plugin', () => {
  const route = new Route({ method: 'GET', path: '/foo' }).use(authPlugin)

  expectTypeOf(route['🔒'].responses['401']).toMatchTypeOf<{
    status: 401
    body?: typeof authBodySchema
    headers?: typeof authHeaderSchema
  }>()
})
