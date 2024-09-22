import { initORPCContract } from '@orpc/contract'
import { InferOutput, number, object, string } from 'valibot'
import { expectTypeOf, it } from 'vitest'
import { initORPCServer } from '..'
import { createUserContract } from '../__tests__/contract'
import { NewUserSchema } from '../__tests__/schemas'
import { ServerRouteBuilder } from './route'

it('infer correct input', () => {
  new ServerRouteBuilder<{ userId: string }, typeof createUserContract>(createUserContract).handler(
    (input) => {
      expectTypeOf(input.method).toEqualTypeOf<'POST'>()
      expectTypeOf(input.path).toMatchTypeOf<string>()
      // TODO: expected undefined schema will be undefined
      expectTypeOf(input.params).toEqualTypeOf<any>()
      expectTypeOf(input.query).toEqualTypeOf<any>()
      expectTypeOf(input.headers).toEqualTypeOf<any>()
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
        status: 201,
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

it('middleware can modify context', () => {
  const routeContract = initORPCContract.route({ method: 'GET', path: '/' })

  initORPCServer
    .context<{ userId: string }>()
    .contract(routeContract)
    .middleware(({ context }) => {
      expectTypeOf(context).toEqualTypeOf<{ userId: string }>()

      return {
        context: {
          you: 'are',
        },
      }
    })
    .middleware(({ context }) => {
      expectTypeOf(context).toEqualTypeOf<{ you: string }>()

      return {
        context: {
          you: 123,
        },
      }
    })
    .handler(({ context }) => {
      expectTypeOf(context).toEqualTypeOf<{ you: number }>()
    })
})

it('middleware can response right away', () => {
  const routeContract = initORPCContract.route({ method: 'GET', path: '/' }).response({
    status: 200,
    body: object({
      you: number(),
    }),
  })

  new ServerRouteBuilder<{ userId: string }, typeof routeContract>(routeContract)
    .middleware(() => {
      return {
        response: {
          status: 200,
          body: {
            you: 123,
          },
        },
      }
    })
    // @ts-expect-error body mismatch
    .middleware(() => {
      return {
        response: {
          status: 200,
          body: {},
        },
      }
    })
})
