import { object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { BodySchema, HeadersSchema, ParamsSchema, QuerySchema } from '../types/validation'
import { Route } from './def'
import { RouteResponses } from './types'

const route = new Route({ method: 'GET', path: '/foo' })
type Internal = {
  method: 'GET'
  path: '/foo'
  description?: string
  ParamsSchema?: ParamsSchema
  QuerySchema?: QuerySchema
  HeadersSchema?: HeadersSchema
  BodySchema?: BodySchema
  responses: RouteResponses
}

it('works after construction', () => {
  expectTypeOf(route['🔒']).toMatchTypeOf<Internal>()
})

it('can set schema', () => {
  const schema = object({
    id: string(),
  })

  expectTypeOf(route.params(schema)['🔒'].params.schema).toMatchTypeOf<typeof schema | undefined>()
  expectTypeOf(route.query(schema)['🔒'].query.schema).toMatchTypeOf<typeof schema | undefined>()
  expectTypeOf(route.headers(schema)['🔒'].headers.schema).toMatchTypeOf<
    typeof schema | undefined
  >()
  expectTypeOf(route.body(schema)['🔒'].body.schema).toMatchTypeOf<typeof schema | undefined>()
})

it('can set responses', () => {
  const schema = object({
    id: string(),
    name: string(),
  })

  expectTypeOf(
    route.response({
      status: 200,
      description: 'foo',
      body: schema,
    })['🔒'].responses[200]
  ).toMatchTypeOf<{
    description?: string
    body?: typeof schema
    headers?: HeadersSchema
  }>()

  expectTypeOf(
    route.response({
      status: 500,
      description: 'foo',
      headers: schema,
    })['🔒'].responses[500]
  ).toMatchTypeOf<{
    description?: string
    body?: BodySchema
    headers?: typeof schema
  }>()
})

it('can chain responses', () => {
  const schema1 = object({
    id: string(),
    name: string(),
  })

  const schema2 = object({
    id: string(),
    name: string(),
    age: string(),
  })

  const route = new Route({ method: 'GET', path: '/foo' })
    .response({
      status: 200,
      description: 'foo',
      body: schema1,
    })
    .response({
      status: 501,
      description: 'foo',
      headers: schema2,
    })

  expectTypeOf(route['🔒'].responses).toMatchTypeOf<{
    '200': {
      description?: string
      body?: typeof schema1
      headers?: HeadersSchema
    }
    '501': {
      description?: string
      body?: BodySchema
      headers?: typeof schema2
    }
  }>()
})

it('can prefix path', () => {
  const route = new Route({ method: 'GET', path: '/foo' }).prefix('/bar')
  expectTypeOf(route['🔒'].path).toMatchTypeOf<'/bar/foo'>()

  const route2 = new Route({ method: 'GET', path: '/foo' }).prefix('/bar/')
  expectTypeOf(route2['🔒'].path).toMatchTypeOf<'/bar/foo'>()

  const route3 = new Route({ method: 'GET', path: '/foo' }).prefix('/')
  expectTypeOf(route3['🔒'].path).toMatchTypeOf<'/foo'>()

  const route4 = new Route({ method: 'GET', path: '/foo/' }).prefix('/')
  expectTypeOf(route4['🔒'].path).toMatchTypeOf<'/foo/'>()

  const route5 = new Route({ method: 'GET', path: '/foo/' }).prefix('/api/')
  expectTypeOf(route5['🔒'].path).toMatchTypeOf<'/api/foo'>()
})
