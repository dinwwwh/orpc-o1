/** dinwwwh */

import { ServerBuilder } from './builder'

export const initORPCServer = new ServerBuilder<Record<string, never>>()

export * from './builder'
export * from './plugin/middleware'
export * from './route'
export * from './router'
export * from './types'
