import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: 'src/setupTests.js',
        exclude: ['**/node_modules/**', '**/e2e/**']
    },
})
