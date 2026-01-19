import { createAuthClient } from 'better-auth/vue';
import { convexClient } from '@convex-dev/better-auth/client/plugins';

export default () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.convexSiteUrl;

  const authClient = createAuthClient({
    fetchOptions: {
      credentials: 'include',
    },
    baseURL,
    plugins: [convexClient()],
  });

  return {
    client: authClient,
  };
};
