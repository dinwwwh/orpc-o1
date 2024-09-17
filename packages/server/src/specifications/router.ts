import { RouteContractSpecification } from '@orpc/contract/__internal__/specifications/route'
import { RouterContractSpecification } from '@orpc/contract/__internal__/specifications/router'
import { ServerContext } from 'src/types'
import { ServerRouteSpecification } from './route'

export type ServerRouterSpecification<
  TContext extends ServerContext = ServerContext,
  TContract extends RouterContractSpecification = RouterContractSpecification
> = {
  [K in keyof TContract]: TContract[K] extends RouteContractSpecification
    ? ServerRouteSpecification<TContext, TContract[K]>
    : TContract[K] extends RouterContractSpecification
    ? ServerRouterSpecification<TContext, TContract[K]>
    : never
}
