import type {
  InferSessionFromClient,
  BetterAuthClientOptions,
  User,
} from 'better-auth/client';

export const authState = defineStore('auth', () => {
  const session = ref<InferSessionFromClient<BetterAuthClientOptions> | null>(null);
  const user = ref<User | null>(null);
  const authInitialized = ref<boolean>(false);
  const sessionLoading = ref<boolean>(false);

  return {
    session,
    user,
    authInitialized,
    sessionLoading,
  };
});
