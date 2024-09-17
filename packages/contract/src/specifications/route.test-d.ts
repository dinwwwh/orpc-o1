import { ValidationSchema } from 'src/types'
import { object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
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
  expectTypeOf(route.__internal__).toMatchTypeOf<Internal>()
})

it('can set schema', () => {
  const schema = object({
    id: string(),
  })

  expectTypeOf(route.params(schema).__internal__.ParamsSchema).toMatchTypeOf<
    typeof schema | undefined
  >()
  expectTypeOf(route.query(schema).__internal__.QuerySchema).toMatchTypeOf<
    typeof schema | undefined
  >()
  expectTypeOf(route.headers(schema).__internal__.HeadersSchema).toMatchTypeOf<
    typeof schema | undefined
  >()
  expectTypeOf(route.body(schema).__internal__.BodySchema).toMatchTypeOf<
    typeof schema | undefined
  >()
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
    }).__internal__.responses[200]
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
    }).__internal__.responses[500]
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

  expectTypeOf(route.__internal__.responses).toMatchTypeOf<{
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
