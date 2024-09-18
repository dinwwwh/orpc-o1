import { RouteContractSpecification, RouterContractSpecification } from '@orpc/contract'
import { ServerContext } from '../types'
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
