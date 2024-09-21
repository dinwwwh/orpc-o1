import type {
  BaseSchema,
  InferInput as InferInput_,
  InferOutput as InferOutput_,
  ObjectSchema,
} from 'valibot'

export type ParamsSchema = ObjectSchema<any, any>
export type QuerySchema = ObjectSchema<any, any>
export type HeadersSchema = ObjectSchema<any, any>
export type BodySchema = BaseSchema<any, any, any>
export type InferInput<T extends BaseSchema<any, any, any>> = InferInput_<T>
export type InferOutput<T extends BaseSchema<any, any, any>> = InferOutput_<T>
