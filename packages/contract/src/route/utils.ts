import { Route } from './def'

export function isRoute(value: unknown): value is Route {
  if (value instanceof Route) return true

  try {
    const internal = (value as any)?.['🔒']

    return (
      typeof internal === 'object' &&
      internal !== null &&
      'method' in internal &&
      typeof internal.method === 'string' &&
      'path' in internal &&
      typeof internal.path === 'string'
    )
  } catch {
    return false
  }
}
