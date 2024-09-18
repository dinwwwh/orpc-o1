import { RouteContractSpecification } from '../specifications/route'
import { RouterContractSpecification } from '../specifications/router'
import { HTTPMethod } from '../types'

export class ContractBuilder {
  route<TMethod extends HTTPMethod, TPath extends string>(
    opts: ConstructorParameters<typeof RouteContractSpecification<TMethod, TPath>>[0]
  ): RouteContractSpecification<TMethod, TPath> {
    return new RouteContractSpecification(opts)
  }

  router<TRouter extends RouterContractSpecification>(router: TRouter): TRouter {
    return router
  }
}
