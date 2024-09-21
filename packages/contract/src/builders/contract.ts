import { RouteContractSpecification } from '../specifications/route'
import {
  createEnhancedRouterContractSpecification,
  EnhancedRouterContractSpecification,
  RouterContractSpecification,
} from '../specifications/router'
import { HTTPMethod, HTTPPath, StandardizeHTTPPath } from '../types/http'
import { standardizeHTTPPath } from '../utils/http'

export class ContractBuilder {
  route<TMethod extends HTTPMethod, TPath extends HTTPPath>(
    opts: ConstructorParameters<typeof RouteContractSpecification<TMethod, TPath>>[0]
  ): RouteContractSpecification<TMethod, StandardizeHTTPPath<TPath>> {
    return new RouteContractSpecification({
      ...opts,
      path: standardizeHTTPPath(opts.path),
    }) as any
  }

  router<TRouter extends RouterContractSpecification>(
    router: TRouter
  ): EnhancedRouterContractSpecification<TRouter> {
    return createEnhancedRouterContractSpecification(router)
  }
}
