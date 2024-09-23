/** dinwwwh */

import { Builder } from './builder'

export const initORPCServer = new Builder<Record<string, never>>()

export * from './builder'
export * from './plugin/middleware'
export * from './route'
export * from './router'
export * from './types'
