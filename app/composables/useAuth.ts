export default () => {
  const { successToast, errorToast } = useToast();

  const client = useAuthClient();

  const handleLogin = async (args: {
    email: string;
    password: string;
    callbackURL?: string;
    rememberMe?: boolean;
  }) => {
    const result = await client.signIn.email({
      email: args.email,
      password: args.password,
      callbackURL: args.callbackURL,
      rememberMe: args.rememberMe,
    });

    if (result.error?.message) {
      await errorToast(result.error.message);
      return;
    }
    await successToast('Login successful!');
    return;
  };

  const handleLogout = async () => {
    await client.signOut();
    await successToast('Logged out successfully!');
  };

  return {
    handleLogin,
    handleLogout,
    client,
  };
};
