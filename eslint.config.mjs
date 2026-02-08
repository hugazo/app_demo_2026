// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  // Your custom configs here
  rules: {
    // Ionic uses web component slots, which have a conflicting name on a deprecated Vue API.
    'vue/no-deprecated-slot-attribute': 'off',
  },
});
