import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: {
        index: 'src/index.ts',
        fetch: 'src/adapters/fetch.ts',
      },
      formats: ['es'],
    },
  },
})
