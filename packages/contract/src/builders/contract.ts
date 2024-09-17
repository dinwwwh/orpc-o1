import { RouteContractSpecification } from 'src/specifications/route'
import { RouterContractSpecification } from 'src/specifications/router'
import { HTTPMethod } from 'src/types'

export class ContractBuilder {
  route<TMethod extends HTTPMethod, TPath extends string>(opts: {
    method: TMethod
    path: TPath
  }): RouteContractSpecification<TMethod, TPath> {
    return new RouteContractSpecification(opts)
  }

  router<TRouter extends RouterContractSpecification>(router: TRouter): TRouter {
    return router
  }
}
