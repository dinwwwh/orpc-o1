import {
  EnhancedRouterContractSpecification,
  RouteContractSpecification,
  RouterContractSpecification,
} from '@orpc/contract'
import { ServerContext } from '../types'
import { ServerRouteSpecification } from './route'

export type ServerRouterSpecification<
  TContext extends ServerContext = ServerContext,
  TContract extends RouterContractSpecification = RouterContractSpecification
> = TContract extends EnhancedRouterContractSpecification<infer TContract2>
  ? {
      [K in keyof TContract2]: TContract2[K] extends RouteContractSpecification
        ? ServerRouteSpecification<TContext, TContract2[K]>
        : TContract2[K] extends RouterContractSpecification
        ? ServerRouterSpecification<TContext, TContract2[K]>
        : never
    }
  : {
      [K in keyof TContract]: TContract[K] extends RouteContractSpecification
        ? ServerRouteSpecification<TContext, TContract[K]>
        : TContract[K] extends RouterContractSpecification
        ? ServerRouterSpecification<TContext, TContract[K]>
        : never
    }
