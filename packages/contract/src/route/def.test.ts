import { object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { BodySchema, HeadersSchema } from '../types/validation'
import { ContractRoute } from './def'

const route = new ContractRoute({ method: 'GET', path: '/foo' })
type Internal = {
  method: 'GET'
  path: '/foo'
}

it('works after construction', () => {
  expectTypeOf(route.__cr).toMatchTypeOf<Internal>()
})

it('can set schema', () => {
  const schema = object({
    id: string(),
  })

  expectTypeOf(route.params(schema).__cr.params?.schema).toMatchTypeOf<typeof schema | undefined>()
  expectTypeOf(route.query(schema).__cr.query?.schema).toMatchTypeOf<typeof schema | undefined>()
  expectTypeOf(route.headers(schema).__cr.headers?.schema).toMatchTypeOf<
    typeof schema | undefined
  >()
  expectTypeOf(route.body(schema).__cr.body?.schema).toMatchTypeOf<typeof schema | undefined>()
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
    }).__cr.responses
  ).toMatchTypeOf<
    | {
        status: 200
        description?: string
        body?: typeof schema
        headers?: HeadersSchema
      }[]
    | undefined
  >()

  expectTypeOf(
    route.response({
      status: 500,
      description: 'foo',
      headers: schema,
    }).__cr.responses
  ).toMatchTypeOf<
    | {
        status: 500
        description?: string
        body?: BodySchema
        headers?: typeof schema
      }[]
    | undefined
  >()
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

  const route = new ContractRoute({ method: 'GET', path: '/foo' })
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

  expectTypeOf(route.__cr.responses).toMatchTypeOf<
    | (
        | {
            description?: string
            body?: typeof schema1
            headers?: HeadersSchema
          }
        | {
            description?: string
            body?: BodySchema
            headers?: typeof schema2
          }
      )[]
    | undefined
  >()
})

it('can prefix path', () => {
  const route = new ContractRoute({ method: 'GET', path: '/foo' }).prefix('/bar')
  expectTypeOf(route.__cr.path).toMatchTypeOf<'/bar/foo'>()

  const route2 = new ContractRoute({ method: 'GET', path: '/foo' }).prefix('/bar/')
  expectTypeOf(route2.__cr.path).toMatchTypeOf<'/bar/foo'>()

  const route3 = new ContractRoute({ method: 'GET', path: '/foo' }).prefix('/')
  expectTypeOf(route3.__cr.path).toMatchTypeOf<'/foo'>()

  const route4 = new ContractRoute({ method: 'GET', path: '/foo/' }).prefix('/')
  expectTypeOf(route4.__cr.path).toMatchTypeOf<'/foo/'>()

  const route5 = new ContractRoute({ method: 'GET', path: '/foo/' }).prefix('/api/')
  expectTypeOf(route5.__cr.path).toMatchTypeOf<'/api/foo'>()
})
