import { initORPCContract } from '@orpc/contract'
import { it } from 'vitest'
import { initORPCServer } from '..'
import { createUserContract, findUserContract, findUserRouterContract } from '../__tests__/contract'
import { ServerBuilder } from '../builder'

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

it('can handle prefix route', () => {
  const contract = initORPCContract.router({
    prefix: initORPCContract.route({
      method: 'GET',
      path: '/prefix',
    }),
  })

  // @ts-expect-error expected prefix
  initORPCServer.contract(contract).router({})

  initORPCServer.contract(contract).router({
    // @ts-expect-error mismatch contract
    prefix: initORPCServer.contract(findUserContract).handler('' as any),
  })

  initORPCServer.contract(contract).router({
    prefix: initORPCServer.contract(contract.prefix).handler('' as any),
  })
})
