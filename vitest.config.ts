import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';

export default defineConfig({
  test: {
    projects: [
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('.', import.meta.url)),
              domEnvironment: 'happy-dom',
            },
          },
        },
      }),
      {
        resolve: {
          alias: {
            '@convex': fileURLToPath(new URL('./convex', import.meta.url)),
          },
        },
        test: {
          name: 'convex',
          include: ['test/convex/**/*.{test,spec}.ts'],
          environment: 'edge-runtime',
        },
      },
    ],
    coverage: {
      enabled: true,
      provider: 'v8',
    },
  },
});
