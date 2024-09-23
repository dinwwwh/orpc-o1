import type {
  BaseSchema as BaseSchema_,
  InferInput as InferInput_,
  InferOutput as InferOutput_,
  ObjectSchema,
} from 'valibot'

export type BaseSchema = BaseSchema_<any, any, any>
export type ParamsSchema = ObjectSchema<any, any>
export type QuerySchema = ObjectSchema<any, any>
export type HeadersSchema = ObjectSchema<any, any>
export type BodySchema = BaseSchema
export type InferInput<T extends BaseSchema> = InferInput_<T>
export type InferOutput<T extends BaseSchema> = InferOutput_<T>
