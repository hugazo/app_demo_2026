export default defineNuxtPlugin(async (nuxtApp) => {
  const client = useAuthClient();
  const convexClient = useConvexClient();

  const getToken = async () => {
    const tokenValue = await client.convex.token();
    return tokenValue.data?.token;
  };

  if (!nuxtApp.payload.serverRendered) {
    await useAuth().loadSession();
    convexClient.setAuth(getToken);
  }
  else if (Boolean(nuxtApp.payload.prerenderedAt) || Boolean(nuxtApp.payload.isCached)) {
    // To avoid hydration mismatch
    nuxtApp.hook('app:mounted', async () => {
      await useAuth().loadSession();
      convexClient.setAuth(getToken);
    });
  }
  console.log('Auth plugin loaded');
});
