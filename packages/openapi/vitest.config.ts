import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: [path.resolve(__dirname, './src/__tests__/setup.ts')],
  },
})
