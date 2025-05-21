import { defineConfig } from 'vitest/config';

export default defineConfig({
 test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8', // or 'c8'
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: ['node_modules/', '.test.ts/','src/Types/**','**/*.test.tsx',       // test files
        '**/*.d.ts', '**/*.config.ts','**/*.config.js','src/main.tsx',
        'src/App.tsx','src/Context','src/Theme'    ],
    },
  },
});
