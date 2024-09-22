/** dinwwwh */

import { ServerBuilder } from './builders/server'

export const initORPCServer = new ServerBuilder<Record<string, never>>()

export * from './builders/route'
export * from './builders/router'
export * from './builders/server'
export * from './specifications/middleware'
export * from './specifications/route'
export * from './specifications/router'
export * from './types'
