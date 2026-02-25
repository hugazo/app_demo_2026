export const appState = defineStore('app', () => {
  const initialized = ref(false);

  return {
    initialized,
  };
});
