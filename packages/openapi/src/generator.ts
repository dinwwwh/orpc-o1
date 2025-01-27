import { BaseSchema, ContractRouter, isContractRoute, RouteResponse } from '@orpc/contract'
import { toJsonSchema } from '@valibot/to-json-schema'
import {
  ContentObject,
  HeaderObject,
  OpenApiBuilder,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
  ResponsesObject,
  SchemaObject,
} from 'openapi3-ts/oas31'
import { array, is, literal, nullish, object, record, safeParse, string, unknown } from 'valibot'

const JsonSchemaSupportOnParametersSchema = object({
  type: literal('object'),
  properties: nullish(record(string(), unknown())),
  required: nullish(array(string())),
  description: nullish(string()),
})

export function generateOpenApiSpec(
  router: ContractRouter,
  spec: Omit<OpenAPIObject, 'openapi'>
): OpenAPIObject {
  const builder = OpenApiBuilder.create({
    ...spec,
    openapi: '3.1.0',
  })

  // TODO: tags
  // TODO: schema references

  const addPathsToBuilderRecursively = (router: ContractRouter) => {
    for (const key in router) {
      const item = router[key]

      if (isContractRoute(item)) {
        const internal = item.__cr

        const requestBody = (() => {
          if (!internal.body?.schema) return undefined

          const content: ContentObject = {}

          content['application/json'] = {
            schema: toJsonSchema(internal.body.schema, { force: true }) as SchemaObject,
            // TODO: examples
            // TODO: example
          }

          return {
            required: true,
            content,
          } satisfies RequestBodyObject
        })()

        const responses = (() => {
          if (!internal.responses || internal.responses.length === 0) return undefined

          const responses: ResponsesObject = {}

          // FIX: case multiple responses with same status
          for (const response_ of internal.responses) {
            const response = response_ as RouteResponse
            const content: ContentObject = {}

            if (response.body) {
              content['application/json'] = {
                schema: toJsonSchema(response.body, { force: true }) as SchemaObject,
                // TODO: examples
                // TODO: example
              }
            }

            let headers: Record<string, HeaderObject> | undefined = (() => {
              if (!response.headers) return undefined

              const headerParameters = getParametersFromSchema(response.headers, 'header')

              const headers: Record<string, HeaderObject> = {}

              for (const parameter of headerParameters) {
                // * By OpenAPI spec, response header should not have `name` and `in`
                const header = {
                  ...parameter,
                  name: undefined,
                  in: undefined,
                }

                delete header.name
                delete header.in

                headers[parameter.name] = header
              }

              return headers
            })()

            responses[response.status] = {
              description: response.description ?? String(response.status),
              content,
              headers,
            } satisfies ResponseObject
          }

          return responses
        })()

        builder.addPath(internal.path, {
          [internal.method.toLowerCase()]: {
            summary: internal.summary,
            description: internal.description,
            deprecated: internal.deprecated,
            parameters: [
              ...getPathParameters(internal.path, internal.params?.schema),
              ...(internal.query?.schema
                ? getParametersFromSchema(internal.query.schema, 'query')
                : []),
              ...(internal.headers?.schema
                ? getParametersFromSchema(internal.headers.schema, 'header')
                : []),
            ],
            requestBody,
            responses,
          } satisfies OperationObject,
        })
      } else {
        addPathsToBuilderRecursively(item)
      }
    }
  }

  addPathsToBuilderRecursively(router)

  return builder.getSpec()
}

function getPathParameters(path: string, schema?: BaseSchema): ParameterObject[] {
  const paramsFromPath = path.match(/{[^}]+}/g)?.map((param) => param.slice(1, -1))

  const parsedSchema = safeParse(
    JsonSchemaSupportOnParametersSchema,
    schema ? toJsonSchema(schema, { force: true }) : undefined
  )

  const params: ParameterObject[] =
    paramsFromPath?.map((param) => ({
      name: param,
      in: 'path',
      required: true,
      description: parsedSchema.success
        ? is(object({ description: string() }), parsedSchema.output.properties?.[param])
          ? parsedSchema.output.properties[param].description
          : undefined
        : undefined,
      schema: parsedSchema.success
        ? is(object({}), parsedSchema.output.properties?.[param])
          ? (parsedSchema.output.properties[param] as SchemaObject)
          : { type: 'string' }
        : { type: 'string' },
      // TODO: example
      // TODO: examples
    })) ?? []

  return params
}

function getParametersFromSchema(
  schema: BaseSchema,
  in_: ParameterObject['in']
): ParameterObject[] {
  const jsonSchema = toJsonSchema(schema, { force: true })

  if (!is(JsonSchemaSupportOnParametersSchema, jsonSchema)) {
    return []
  }

  if (!jsonSchema.properties || Object.keys(jsonSchema.properties).length === 0) {
    return []
  }

  const params: ParameterObject[] = Object.entries(jsonSchema.properties).map(([name, schema]) => {
    return {
      name,
      in: in_,
      required: (jsonSchema.required ?? []).includes(name),
      description: is(object({ description: string() }), schema) ? schema.description : undefined,
      schema: is(object({}), schema) ? (schema as SchemaObject) : { type: 'string' },
      // TODO: example
      // TODO: examples
    }
  })

  return params
}
