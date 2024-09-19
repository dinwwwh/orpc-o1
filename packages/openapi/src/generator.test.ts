import { initORPCContract } from '@orpc/contract'
import { OpenAPIObject } from 'openapi3-ts/oas31'
import {
  description,
  integer,
  maxValue,
  minValue,
  nullish,
  number,
  object,
  optional,
  pipe,
  string,
  transform,
  union,
} from 'valibot'
import { expect, it } from 'vitest'
import { generateOpenApiSpec } from './generator'

const orpc = initORPCContract

it('simple case', () => {
  const spec = generateOpenApiSpec(
    orpc.router({
      ping: orpc
        .route({
          method: 'GET',
          path: '/ping',
          summary: 'route summary',
          description: 'route description',
          deprecated: true,
        })
        .response({
          status: 200,
          body: string(),
          description: 'response description',
        }),
    }),
    {
      info: {
        title: 'test',
        version: '1.0.0',
      },
    }
  )

  expect(spec).toMatchObject({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/ping': {
        get: {
          summary: 'route summary',
          description: 'route description',
          deprecated: true,
          responses: {
            '200': {
              description: 'response description',
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  } satisfies OpenAPIObject)
})

it('with params', () => {
  const spec = generateOpenApiSpec(
    orpc.router({
      ping: orpc
        .route({
          method: 'GET',
          path: '/ping/{name}/{age}',
        })
        .params(
          object({
            age: pipe(number(), description('age description')),

            // Because it not in the path, it will never appear on openapi spec
            nothing: nullish(string()),
          })
        )
        .response({
          status: 200,
          body: string(),
        }),
    }),
    {
      info: {
        title: 'test',
        version: '1.0.0',
      },
    }
  )

  expect(spec).toMatchObject({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/ping/{name}/{age}': {
        get: {
          deprecated: undefined,
          parameters: [
            { name: 'name', in: 'path', required: true, schema: { type: 'string' } },
            {
              name: 'age',
              in: 'path',
              required: true,
              schema: { type: 'number' },
              description: 'age description',
            },
          ],
          responses: {
            '200': {
              description: '200',
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  } satisfies OpenAPIObject)
})

it('with query & headers', () => {
  const spec = generateOpenApiSpec(
    orpc.router({
      ping: orpc
        .route({
          method: 'GET',
          path: '/ping',
        })
        .query(
          object({
            search: optional(string()),
            limit: pipe(
              union([string(), number()]),
              transform((v) => Number(v)),
              integer(),
              minValue(1),
              maxValue(50),
              description('limit description')
            ),
          })
        )
        .headers(
          pipe(
            object({
              'x-token': pipe(string(), description('x-token description')),
            }),
            transform((v) => v)
          )
        )
        .response({
          status: 200,
          body: string(),
        }),
    }),
    {
      info: {
        title: 'test',
        version: '1.0.0',
      },
    }
  )

  expect(spec).toMatchObject({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/ping': {
        get: {
          parameters: [
            {
              name: 'search',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'limit',
              in: 'query',
              required: true,
              description: 'limit description',
              schema: { type: 'integer', minimum: 1, maximum: 50 },
            },
            {
              name: 'x-token',
              in: 'header',
              required: true,
              description: 'x-token description',
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: '200',
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  } satisfies OpenAPIObject)
})

it('with complex response', () => {
  const spec = generateOpenApiSpec(
    orpc.router({
      // SPECIAL CASE: prefix should be care
      prefix: orpc
        .route({
          method: 'GET',
          path: '/ping',
        })
        .response({
          status: 200,
          body: pipe(
            object({
              id: string(),
            }),
            transform((v) => v)
          ),
        })
        .response({
          status: 209,
          body: object({
            code: number(),
            message: string(),
          }),
          headers: object({
            'x-token-x': pipe(string(), description('x-token-x description')),
          }),
        })
        .response({
          status: 429,
          body: object({
            message: string(),
          }),
          headers: object({
            'retry-after': pipe(string(), description('retry-after description')),
            'x-max-retry': pipe(optional(string()), description('x-max-retry description')),
          }),
        }),

      user: {
        find: initORPCContract
          .route({
            method: 'GET',
            path: '/user/{id}',
          })
          .response({
            status: 200,
            body: object({
              id: string(),
            }),
          }),
      },
    }),
    {
      info: {
        title: 'test',
        version: '1.0.0',
      },
    }
  )

  expect(spec).toMatchObject({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/ping': {
        get: {
          responses: {
            '200': {
              description: '200',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                    },
                    required: ['id'],
                    additionalProperties: false,
                  },
                },
              },
            },
            '209': {
              description: '209',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'number',
                      },
                      message: {
                        type: 'string',
                      },
                    },
                    required: ['code', 'message'],
                    additionalProperties: false,
                  },
                },
              },
              headers: {
                'x-token-x': {
                  description: 'x-token-x description',
                  required: true,
                },
              },
            },
            '429': {
              description: '429',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                      },
                    },
                    required: ['message'],
                    additionalProperties: false,
                  },
                },
              },
              headers: {
                'retry-after': {
                  description: 'retry-after description',
                  required: true,
                },
                'x-max-retry': {
                  description: 'x-max-retry description',
                  required: false,
                },
              },
            },
          },
        },
      },
      '/user/{id}': {
        get: {
          responses: {
            '200': {
              description: '200',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                    },
                    required: ['id'],
                    additionalProperties: false,
                  },
                },
              },
            },
          },
        },
      },
    },
  } satisfies OpenAPIObject)
})
