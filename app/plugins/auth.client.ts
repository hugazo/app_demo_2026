export default defineNuxtPlugin(async () => {
  const { initializeApp } = useAppStatus();

  await initializeApp();
});
