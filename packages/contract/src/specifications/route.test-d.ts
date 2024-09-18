import { object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { ValidationSchema } from '../types'
import { RouteContractSpecification, RouteResponses } from './route'

const route = new RouteContractSpecification({ method: 'GET', path: '/foo' })
type Internal = {
  method: 'GET'
  path: '/foo'
  description?: string
  ParamsSchema?: ValidationSchema
  QuerySchema?: ValidationSchema
  HeadersSchema?: ValidationSchema
  BodySchema?: ValidationSchema
  responses: RouteResponses
}

it('works after construction', () => {
  expectTypeOf(route['🔒']).toMatchTypeOf<Internal>()
})

it('can set schema', () => {
  const schema = object({
    id: string(),
  })

  expectTypeOf(route.params(schema)['🔒'].ParamsSchema).toMatchTypeOf<typeof schema | undefined>()
  expectTypeOf(route.query(schema)['🔒'].QuerySchema).toMatchTypeOf<typeof schema | undefined>()
  expectTypeOf(route.headers(schema)['🔒'].HeadersSchema).toMatchTypeOf<typeof schema | undefined>()
  expectTypeOf(route.body(schema)['🔒'].BodySchema).toMatchTypeOf<typeof schema | undefined>()
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
    description: string
    body?: typeof schema
    headers?: ValidationSchema
  }>()

  expectTypeOf(
    route.response({
      status: 500,
      description: 'foo',
      headers: schema,
    })['🔒'].responses[500]
  ).toMatchTypeOf<{
    description: string
    body?: ValidationSchema
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

  const route = new RouteContractSpecification({ method: 'GET', path: '/foo' })
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
      description: string
      body?: typeof schema1
      headers?: ValidationSchema
    }
    '501': {
      description: string
      body?: ValidationSchema
      headers?: typeof schema2
    }
  }>()
})
