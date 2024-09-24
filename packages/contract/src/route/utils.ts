import { ContractRoute } from './def'

export function isContractRoute(value: unknown): value is ContractRoute {
  if (value instanceof ContractRoute) return true

  try {
    const internal = (value as any)?.__cr

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
