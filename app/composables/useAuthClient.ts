import { createAuthClient } from 'better-auth/vue';
import { convexClient, crossDomainClient } from '@convex-dev/better-auth/client/plugins';

export default () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.convexSiteUrl;

  const authClient = createAuthClient({
    baseURL,
    plugins: [
      convexClient(),
      crossDomainClient(),
    ],
    fetchOptions: {
      credentials: 'include',
    },
  });

  return authClient;
};
