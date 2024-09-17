import { initORPCContract } from '@orpc/contract'
import { createUserContract } from 'src/__tests__/contract'
import { NewUserSchema } from 'src/__tests__/schemas'
import { InferOutput, object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { ServerRouteBuilder } from './route'

it('infer correct input', () => {
  new ServerRouteBuilder<{ userId: string }, typeof createUserContract>(createUserContract).handler(
    (input) => {
      expectTypeOf(input.method).toEqualTypeOf<'POST'>()
      expectTypeOf(input.path).toMatchTypeOf<string>()
      expectTypeOf(input.params).toEqualTypeOf<unknown>()
      expectTypeOf(input.query).toEqualTypeOf<unknown>()
      expectTypeOf(input.headers).toEqualTypeOf<unknown>()
      expectTypeOf(input.body).toEqualTypeOf<InferOutput<typeof NewUserSchema>>()

      return '' as any
    }
  )

  const fullContract = initORPCContract
    .route({
      method: 'DELETE',
      path: '/users',
    })
    .params(
      object({
        paramId: string(),
      })
    )
    .query(
      object({
        queryId: string(),
      })
    )
    .headers(
      object({
        headerId: string(),
      })
    )
    .body(
      object({
        bodyId: string(),
      })
    )

  new ServerRouteBuilder<{ userId: string }, typeof fullContract>(fullContract).handler((input) => {
    expectTypeOf(input.method).toEqualTypeOf<'DELETE'>()
    expectTypeOf(input.path).toMatchTypeOf<string>()
    expectTypeOf(input.params).toEqualTypeOf<{ paramId: string }>()
    expectTypeOf(input.query).toEqualTypeOf<{ queryId: string }>()
    expectTypeOf(input.headers).toEqualTypeOf<{ headerId: string }>()
    expectTypeOf(input.body).toEqualTypeOf<{ bodyId: string }>()

    return '' as any
  })
})

it('infer correct output', () => {
  new ServerRouteBuilder<{ userId: string }, typeof createUserContract>(createUserContract).handler(
    async () => {
      return {
        status: 200,
        body: {
          id: 'id',
          name: 'name',
        },
      }
    }
  )

  new ServerRouteBuilder<{ userId: string }, typeof createUserContract>(createUserContract).handler(
    // @ts-expect-error name must be string
    async () => {
      return {
        status: 200,
        body: {
          id: 'id',
          name: 123,
        },
      }
    }
  )

  new ServerRouteBuilder<{ userId: string }, typeof createUserContract>(createUserContract).handler(
    async () => {
      return {
        status: 400,
        body: {
          message: 'message',
        },
      }
    }
  )

  new ServerRouteBuilder<{ userId: string }, typeof createUserContract>(createUserContract).handler(
    // @ts-expect-error body mismatch
    async () => {
      return {
        status: 400,
        body: {
          id: 'id',
          name: 'name',
        },
      }
    }
  )

  new ServerRouteBuilder<{ userId: string }, typeof createUserContract>(createUserContract).handler(
    // @ts-expect-error status mismatch
    async () => {
      return {
        status: 500,
        body: {
          id: 'id',
          name: 'name',
        },
      }
    }
  )
})

it('does not allow handler return if not specified', () => {
  const routeContract = initORPCContract.route({ method: 'GET', path: '/' })

  new ServerRouteBuilder<{ userId: string }, typeof routeContract>(routeContract).handler(() => {})
  new ServerRouteBuilder<{ userId: string }, typeof routeContract>(routeContract).handler(
    async () => {}
  )

  new ServerRouteBuilder<{ userId: string }, typeof routeContract>(routeContract).handler(
    // @ts-expect-error handler must not return
    () => ({})
  )
})
