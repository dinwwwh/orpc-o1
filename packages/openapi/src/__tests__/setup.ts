import { expect, vi } from 'vitest'
import type { generateOpenApiSpec } from '../generator'
import { validateOpenApiSpec } from './utils'

const generator = await vi.importActual('../generator.js')

vi.mock('../generator', () => ({
  generateOpenApiSpec: vi.fn((...args) => {
    // @ts-expect-error
    const spec = generator.generateOpenApiSpec(...args)
    expect(validateOpenApiSpec(spec)).resolves.toBe(true)
    return spec
  }) as typeof generateOpenApiSpec,
}))
