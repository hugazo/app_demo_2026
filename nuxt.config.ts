export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/hints',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxtjs/ionic',
    'convex-nuxt',
  ],
  // Forces SPA Mode, needed for Ionic Framework
  ssr: false,
  devtools: { enabled: true },
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
});
