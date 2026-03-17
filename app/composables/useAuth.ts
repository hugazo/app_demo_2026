type EmailSignInArgs = {
  email: string;
  password: string;
  callbackURL?: string;
  rememberMe?: boolean;
};

export type EmailSignInHandler = (args: EmailSignInArgs) => Promise<void>;
export const EmailSignInHandlerKey = Symbol() as InjectionKey<EmailSignInHandler>;

export type LogoutHandler = () => Promise<void>;
export const LogoutHandlerKey = Symbol() as InjectionKey<LogoutHandler>;

export const useAuth = () => {
  const {
    session,
    user,
    authInitialized,
    sessionLoading,
  } = storeToRefs(authState());

  const authClient = useAuthClient();
  const convexClient = useConvexClient();
  const router = useIonRouter();
  const { successToast, errorToast } = useToast();

  const loadSession = async () => {
    if (sessionLoading.value) return;
    sessionLoading.value = true;

    try {
      const { data } = await authClient.getSession();

      session.value = data?.session || null;
      user.value = data?.user || null;
      authInitialized.value = true;

      if (session.value) {
        convexClient.setAuth($getToken);
      }
    }
    finally {
      sessionLoading.value = false;
    }
  };

  const loggedIn = computed(() => !!session.value);

  const handleEmailSignIn = async (args: EmailSignInArgs) => {
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
    await loadSession();
    router.navigate('/tabs/home');
    await successToast('Email sign-in successful!');
  };

  const handleLogout = async () => {
    const result = await authClient.signOut();

    if (result.error) {
      await errorToast(result.error?.message || 'Logout failed');
      return;
    }
    convexClient.close();
    session.value = null;
    user.value = null;
    router.navigate('/login');
    await successToast('Logged out successfully!');
  };

  const $getToken = async () => {
    const tokenValue = await authClient.convex.token();
    return tokenValue?.data?.token || null;
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
