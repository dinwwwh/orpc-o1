import { RouteContractSpecification } from './route'

export type RouterContractSpecification<
  T extends Record<string, RouteContractSpecification | RouterContractSpecification> = any
> = T
