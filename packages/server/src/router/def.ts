import { Route as ContractRoute, Router as ContractRouter, EnhancedRouter } from '@orpc/contract'
import { Route } from '../route/def'
import { Context } from '../types'

export type Router<
  TContext extends Context = any,
  TContract extends ContractRouter = any
> = TContract extends EnhancedRouter<infer TContract2>
  ? {
      [K in keyof TContract2]: TContract2[K] extends ContractRoute
        ? Route<TContext, TContract2[K]>
        : TContract2[K] extends ContractRouter
        ? Router<TContext, TContract2[K]>
        : never
    }
  : {
      [K in keyof TContract]: TContract[K] extends ContractRoute
        ? Route<TContext, TContract[K]>
        : TContract[K] extends ContractRouter
        ? Router<TContext, TContract[K]>
        : never
    }
