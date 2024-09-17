import { initORPCContract } from '@orpc/contract'
import { object, string } from 'valibot'
import { NewUserSchema, UserSchema } from './schemas'

const orpc = initORPCContract

export const findUserContract = orpc
  .route({ method: 'GET', path: '/users/{id}' })
  .params(
    object({
      id: string(),
    })
  )
  .response({
    description: 'find user',
    status: 200,
    body: UserSchema,
  })

export const findUserRouterContract = orpc.router({
  find: findUserContract,
})

export const createUserContract = orpc
  .route({ method: 'POST', path: '/users' })
  .body(NewUserSchema)
  .response({
    description: 'create user',
    status: 200,
    body: UserSchema,
  })
  .response({
    description: 'existing user',
    status: 400,
    body: object({
      message: string(),
    }),
  })

export const userRouterContract = orpc.router({
  find: findUserContract,
  create: createUserContract,
})
