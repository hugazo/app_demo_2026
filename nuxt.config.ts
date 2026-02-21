import { createResolver } from '@nuxt/kit';

const resolver = createResolver(import.meta.url);

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxtjs/ionic',
    'convex-nuxt',
  ],
  // Forces SPA Mode, needed for iOS/Android builds with Capacitor
  ssr: false,
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      convexSiteUrl: process.env.CONVEX_SITE_URL,
    },
  },
  alias: {
    '@convex': resolver.resolve('convex'),
  },
  compatibilityDate: '2025-07-15',
  convex: {
    url: process.env.CONVEX_URL,
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
      },
    },
  },
  hints: {
    hydration: false,
  },
});
