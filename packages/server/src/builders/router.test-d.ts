import { it } from 'vitest'
import { createUserContract, findUserContract, findUserRouterContract } from '../__tests__/contract'
import { ServerBuilder } from './server'

const server1 = new ServerBuilder<{ userId: string }>()
const server2 = new ServerBuilder<{ userId: number }>()

it('required match context and contract', () => {
  server1.contract(findUserRouterContract).router({
    find: server1.contract(findUserContract).handler('' as any),
  })

  server1.contract(findUserRouterContract).router({
    // @ts-expect-error mismatch context
    find: server2.contract(findUserContract).handler('' as any),
  })

  server1.contract(findUserRouterContract).router({
    // @ts-expect-error mismatch contract
    find: server1.contract(createUserContract).handler('' as any),
  })
})
