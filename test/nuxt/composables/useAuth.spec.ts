import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authState } from '@/stores/auth';
import { useAuth } from '@/composables/useAuth';

const mockUseAuthClient = vi.hoisted(() => vi.fn());
const mockUseConvexClient = vi.hoisted(() => vi.fn());
const mockUseIonRouter = vi.hoisted(() => vi.fn());
const mockUseToast = vi.hoisted(() => vi.fn());

mockNuxtImport('useAuthClient', () => mockUseAuthClient);
mockNuxtImport('useConvexClient', () => mockUseConvexClient);
mockNuxtImport('useIonRouter', () => mockUseIonRouter);
mockNuxtImport('useToast', () => mockUseToast);

describe('useAuth composable', () => {
  const mockGetSession = vi.fn();
  const mockSignInEmail = vi.fn();
  const mockSignOut = vi.fn();
  const mockConvexToken = vi.fn();

  const mockSetAuth = vi.fn();
  const mockClose = vi.fn();

  const mockNavigate = vi.fn();
  const mockSuccessToast = vi.fn();
  const mockErrorToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    setActivePinia(createPinia());

    mockUseAuthClient.mockReturnValue({
      getSession: mockGetSession,
      signIn: {
        email: mockSignInEmail,
      },
      signOut: mockSignOut,
      convex: {
        token: mockConvexToken,
      },
    });

    mockUseConvexClient.mockReturnValue({
      setAuth: mockSetAuth,
      close: mockClose,
    });

    mockUseIonRouter.mockReturnValue({
      navigate: mockNavigate,
    });

    mockUseToast.mockReturnValue({
      successToast: mockSuccessToast,
      errorToast: mockErrorToast,
    });

    mockGetSession.mockResolvedValue({
      data: null,
    });
    mockSignInEmail.mockResolvedValue({ error: null });
    mockSignOut.mockResolvedValue({ error: null });
    mockConvexToken.mockResolvedValue({ data: { token: 'convex_token' } });
  });

  it('returns false for loggedIn when no session exists', () => {
    const { loggedIn } = useAuth();

    expect(loggedIn.value).toBe(false);
  });

  it('loadSession exits early when session is already loading', async () => {
    const store = authState();
    store.sessionLoading = true;
    const { loadSession } = useAuth();

    await loadSession();

    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('loadSession stores session/user and registers convex auth callback', async () => {
    const mockSession = { id: 's1' };
    const mockUser = { id: 'u1', email: 'user@example.com' };

    mockGetSession.mockResolvedValueOnce({
      data: {
        session: mockSession,
        user: mockUser,
      },
    });

    const { loadSession, loggedIn, authInitialized } = useAuth();

    await loadSession();

    expect(mockGetSession).toHaveBeenCalledOnce();
    expect(loggedIn.value).toBe(true);
    expect(authInitialized.value).toBe(true);
    expect(mockSetAuth).toHaveBeenCalledOnce();

    const getToken = mockSetAuth.mock.calls[0]?.[0] as (() => Promise<string | null>);
    const token = await getToken();

    expect(mockConvexToken).toHaveBeenCalledOnce();
    expect(token).toBe('convex_token');
  });

  it('loadSession sets session and user to null when payload is missing', async () => {
    const store = authState();
    store.session = { id: 'old_session' } as never;
    store.user = { id: 'old_user' } as never;

    mockGetSession.mockResolvedValueOnce({ data: undefined });

    const { loadSession, session, user, authInitialized } = useAuth();

    await loadSession();

    expect(session.value).toBeNull();
    expect(user.value).toBeNull();
    expect(authInitialized.value).toBe(true);
    expect(mockSetAuth).not.toHaveBeenCalled();
  });

  it('loadSession always clears sessionLoading even when getSession fails', async () => {
    let resolveGetSession: (value: unknown) => void = () => {};

    const pendingGetSession = new Promise((resolve) => {
      resolveGetSession = resolve;
    });
    mockGetSession.mockReturnValueOnce(pendingGetSession);

    const { loadSession, sessionLoading } = useAuth();

    const pendingLoad = loadSession();
    expect(sessionLoading.value).toBe(true);

    resolveGetSession({ data: null });
    await pendingLoad;

    expect(sessionLoading.value).toBe(false);

    mockGetSession.mockRejectedValueOnce(new Error('network error'));

    await expect(loadSession()).rejects.toThrow('network error');
    expect(sessionLoading.value).toBe(false);
  });

  it('handleEmailSignIn shows error toast and exits when sign-in fails', async () => {
    mockSignInEmail.mockResolvedValueOnce({
      error: { message: 'Invalid credentials' },
    });

    const { handleEmailSignIn } = useAuth();

    await handleEmailSignIn({
      email: 'user@example.com',
      password: 'bad-password',
    });

    expect(mockErrorToast).toHaveBeenCalledWith('Invalid credentials');
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSuccessToast).not.toHaveBeenCalled();
  });

  it('handleEmailSignIn uses fallback error message when backend omits details', async () => {
    mockSignInEmail.mockResolvedValueOnce({
      error: {},
    });

    const { handleEmailSignIn } = useAuth();

    await handleEmailSignIn({
      email: 'user@example.com',
      password: 'bad-password',
    });

    expect(mockErrorToast).toHaveBeenCalledWith('Email sign-in failed');
  });

  it('handleEmailSignIn loads session, navigates home, and shows success toast', async () => {
    mockGetSession.mockResolvedValueOnce({
      data: {
        session: { id: 'session_after_signin' },
        user: { id: 'user_after_signin' },
      },
    });

    const { handleEmailSignIn, session, user } = useAuth();

    await handleEmailSignIn({
      email: 'user@example.com',
      password: 'strong-password',
      callbackURL: '/tabs/home',
      rememberMe: true,
    });

    expect(mockSignInEmail).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'strong-password',
      callbackURL: '/tabs/home',
      rememberMe: true,
    });
    expect(mockGetSession).toHaveBeenCalledOnce();
    expect(session.value).toEqual({ id: 'session_after_signin' });
    expect(user.value).toEqual({ id: 'user_after_signin' });
    expect(mockNavigate).toHaveBeenCalledWith('/tabs/home');
    expect(mockSuccessToast).toHaveBeenCalledWith('Email sign-in successful!');
  });

  it('handleLogout shows error toast and skips logout side effects on failure', async () => {
    mockSignOut.mockResolvedValueOnce({
      error: { message: 'Logout failed remotely' },
    });

    const { handleLogout } = useAuth();

    await handleLogout();

    expect(mockErrorToast).toHaveBeenCalledWith('Logout failed remotely');
    expect(mockClose).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSuccessToast).not.toHaveBeenCalled();
  });

  it('handleLogout uses fallback error message when backend omits details', async () => {
    mockSignOut.mockResolvedValueOnce({
      error: {},
    });

    const { handleLogout } = useAuth();

    await handleLogout();

    expect(mockErrorToast).toHaveBeenCalledWith('Logout failed');
  });

  it('handleLogout clears auth state, closes convex client, and navigates to login', async () => {
    const store = authState();
    store.session = { id: 'active_session' } as never;
    store.user = { id: 'active_user' } as never;

    const { handleLogout, session, user } = useAuth();

    await handleLogout();

    expect(mockSignOut).toHaveBeenCalledOnce();
    expect(mockClose).toHaveBeenCalledOnce();
    expect(session.value).toBeNull();
    expect(user.value).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockSuccessToast).toHaveBeenCalledWith('Logged out successfully!');
  });

  it('returns null token when convex token payload is missing', async () => {
    mockGetSession.mockResolvedValueOnce({
      data: {
        session: { id: 'session_with_missing_token' },
        user: { id: 'user_with_missing_token' },
      },
    });
    mockConvexToken.mockResolvedValueOnce({ data: undefined });

    const { loadSession } = useAuth();

    await loadSession();

    const getToken = mockSetAuth.mock.calls[0]?.[0] as (() => Promise<string | null>);
    await expect(getToken()).resolves.toBeNull();
  });
});