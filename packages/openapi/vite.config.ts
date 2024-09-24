import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['es'],
    },
  },
})
