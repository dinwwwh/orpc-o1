import { ContractRoute } from '../route/def'

export type ContractRouter<T extends Record<string, ContractRoute | ContractRouter> = any> = T
