import type { IsAny, Simplify } from 'type-fest'

export type UndefinedProperties<T> = {
  [P in keyof T]-?: undefined extends T[P] ? P : never
}[keyof T]

export type OptionalOnUndefined<T> = Simplify<
  Partial<Pick<T, UndefinedProperties<T>>> & Pick<T, Exclude<keyof T, UndefinedProperties<T>>>
>

export type MergeUnions<TA, TB> = IsAny<TA> extends true
  ? TB
  : IsAny<TB> extends true
  ? TA
  : TA | TB
