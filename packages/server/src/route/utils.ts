import { ServerRoute } from './def'

export function isServerRoute(value: unknown): value is ServerRoute {
  if (value instanceof ServerRoute) return true

  // TODO: should has a schema validation here
  return false
}
