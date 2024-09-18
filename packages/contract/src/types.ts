import { BaseIssue, BaseSchema } from 'valibot'

export type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
export type HTTPPath = string
export type HTTPStatus = number
export type ValidationSchema = BaseSchema<unknown, unknown, BaseIssue<unknown>>
