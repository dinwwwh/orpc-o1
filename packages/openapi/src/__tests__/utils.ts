import OpenAPIParser from '@readme/openapi-parser'

export async function validateOpenApiSpec(spec: any): Promise<boolean> {
  try {
    await OpenAPIParser.validate(spec)
    return true
  } catch (e) {
    console.log(JSON.stringify(spec, null, 2))

    throw e
  }
}
