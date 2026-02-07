export default defineNuxtPlugin(async () => {
  const client = useAuthClient();

  const convexClient = useConvexClient();

  const getToken = async () => {
    const tokenValue = await client.convex.token();

    return tokenValue.data?.token;
  };

  convexClient.setAuth(getToken);
});
