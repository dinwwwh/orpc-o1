import { Simplify } from 'type-fest'
import { BaseIssue, BaseSchema } from 'valibot'

export type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
export type HTTPPath = string
export type HTTPStatus = number
export type ValidationSchema = BaseSchema<unknown, unknown, BaseIssue<unknown>>

export type UndefinedProperties<T> = {
  [P in keyof T]-?: undefined extends T[P] ? P : never
}[keyof T]

export type OptionalOnUndefined<T> = Simplify<
  Partial<Pick<T, UndefinedProperties<T>>> & Pick<T, Exclude<keyof T, UndefinedProperties<T>>>
>
