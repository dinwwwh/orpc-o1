import { Route } from '../route/def'

export type Router<T extends Record<string, Route | Router> = any> = T
