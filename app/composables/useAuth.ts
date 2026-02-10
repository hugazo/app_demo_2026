import type {
  InferSessionFromClient,
  BetterAuthClientOptions,
  User,
} from 'better-auth/client';

type EmailSignInArgs = {
  email: string;
  password: string;
  callbackURL?: string;
  rememberMe?: boolean;
};

export type EmailSignInHandler = (args: EmailSignInArgs) => Promise<void>;
export const EmailSignInHandlerKey = Symbol() as InjectionKey<EmailSignInHandler>;

export const useAuth = () => {
  const authClient = useAuthClient();
  const convexClient = useConvexClient();
  const router = useIonRouter();
  const { successToast, errorToast } = useToast();

  const session = useState<InferSessionFromClient<BetterAuthClientOptions> | null>('auth:session', () => null);
  const user = useState<User | null>('auth:user', () => null);
  const authInitialized = useState<boolean>('auth:initialized', () => false);
  const sessionLoading = useState<boolean>('auth:sessionLoading', () => false);

  const loadSession = async () => {
    if (sessionLoading.value) return;

    sessionLoading.value = true;

    const { data, error } = await authClient.getSession();

    console.log('Loaded session data:', data, error);

    session.value = data?.session || null;
    user.value = data?.user || null;
    authInitialized.value = true;
    sessionLoading.value = false;
  };

  const loggedIn = computed(() => !!session.value);

  if (import.meta.client) {
    authClient.$store.listen('$sessionSignal', async (signal) => {
      if (!signal)
        return;
      await loadSession();
    });
  }

  const handleEmailSignIn = async (args: {
    email: string;
    password: string;
    callbackURL?: string;
    rememberMe?: boolean;
  }) => {
    const result = await authClient.signIn.email({
      email: args.email,
      password: args.password,
      callbackURL: args.callbackURL,
      rememberMe: args.rememberMe,
    });
    if (result.error) {
      await errorToast(result.error?.message || 'Email sign-in failed');
      return;
    }
    router.push('/');
    await successToast('Email sign-in successful!');
  };

  const handleLogout = async () => {
    const result = await authClient.signOut();
    if (result.error) {
      await errorToast(result.error?.message || 'Logout failed');
      return;
    }
    await convexClient.close();
    await successToast('Logged out successfully!');

    router.push('/login');
  };

  return {
    session,
    user,
    sessionLoading,
    loadSession,
    loggedIn,
    authInitialized,
    handleLogout,
    handleEmailSignIn,
  };
};
