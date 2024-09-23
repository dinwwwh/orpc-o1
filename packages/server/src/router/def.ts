import { ContractRoute, ContractRouter, EnhancedContractRouter } from '@orpc/contract'
import { ServerRoute } from '../route/def'
import { ServerContext } from '../types'

export type ServerRouter<
  TContext extends ServerContext = any,
  TContract extends ContractRouter = any
> = TContract extends EnhancedContractRouter<infer TContract2>
  ? {
      [K in keyof TContract2]: TContract2[K] extends ContractRoute
        ? ServerRoute<TContext, TContract2[K]>
        : TContract2[K] extends ContractRouter
        ? ServerRouter<TContext, TContract2[K]>
        : never
    }
  : {
      [K in keyof TContract]: TContract[K] extends ContractRoute
        ? ServerRoute<TContext, TContract[K]>
        : TContract[K] extends ContractRouter
        ? ServerRouter<TContext, TContract[K]>
        : never
    }
