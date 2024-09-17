declare module 'trek-router' {
  export default class Router<T = unknown> {
    add(method: string, path: string, payload: T): void
    find(method: string, path: string): [T | undefined, { name: string; value: string }[]]
  }
}
