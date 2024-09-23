import { EnhancedRouter, Route, Router } from '@orpc/contract'
import { Context } from '../types'
import { ServerRouteSpecification } from './route'

export type ServerRouterSpecification<
  TContext extends Context = any,
  TContract extends Router = any
> = TContract extends EnhancedRouter<infer TContract2>
  ? {
      [K in keyof TContract2]: TContract2[K] extends Route
        ? ServerRouteSpecification<TContext, TContract2[K]>
        : TContract2[K] extends Router
        ? ServerRouterSpecification<TContext, TContract2[K]>
        : never
    }
  : {
      [K in keyof TContract]: TContract[K] extends Route
        ? ServerRouteSpecification<TContext, TContract[K]>
        : TContract[K] extends Router
        ? ServerRouterSpecification<TContext, TContract[K]>
        : never
    }
