import { Route } from './def'

export function isRoute(value: unknown): value is Route {
  if (value instanceof Route) return true

  // TODO: should has a schema validation here
  return false
}
