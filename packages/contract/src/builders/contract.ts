import { RouteContractSpecification } from '../specifications/route'
import {
  createEnhancedRouterContractSpecification,
  EnhancedRouterContractSpecification,
  RouterContractSpecification,
} from '../specifications/router'
import { HTTPMethod } from '../types'

export class ContractBuilder {
  route<TMethod extends HTTPMethod, TPath extends string>(
    opts: ConstructorParameters<typeof RouteContractSpecification<TMethod, TPath>>[0]
  ): RouteContractSpecification<TMethod, TPath> {
    return new RouteContractSpecification(opts)
  }

  router<TRouter extends RouterContractSpecification>(
    router: TRouter
  ): EnhancedRouterContractSpecification<TRouter> {
    return createEnhancedRouterContractSpecification(router)
  }
}
