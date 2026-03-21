import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import authMiddleware from '@/middleware/01-auth.global';

const mockUseAuth = vi.hoisted(() => vi.fn());
const mockNavigateTo = vi.hoisted(() => vi.fn((path: string) => path));

mockNuxtImport('useAuth', () => mockUseAuth);
mockNuxtImport('navigateTo', () => mockNavigateTo);

type MiddlewareTo = Parameters<typeof authMiddleware>[0];
type MiddlewareFrom = Parameters<typeof authMiddleware>[1];

const createTo = (path: string, allowUnauthenticated = false): MiddlewareTo => ({
  path,
  meta: {
    allowUnauthenticated,
  },
} as unknown as MiddlewareTo);

describe('01-auth.global middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ loggedIn: ref(false) });
  });

  it('returns early while hydrating a server-rendered payload', async () => {
    const nuxtApp = useNuxtApp();
    const previousHydrationState = nuxtApp.isHydrating;
    const previousServerRendered = nuxtApp.payload.serverRendered;

    nuxtApp.isHydrating = true;
    nuxtApp.payload.serverRendered = true;

    const result = await authMiddleware(createTo('/tabs/home'), {} as MiddlewareFrom);

    expect(result).toBeUndefined();
    expect(mockNavigateTo).not.toHaveBeenCalled();

    nuxtApp.isHydrating = previousHydrationState;
    nuxtApp.payload.serverRendered = previousServerRendered;
  });

  it('redirects authenticated users away from login', async () => {
    mockUseAuth.mockReturnValue({ loggedIn: ref(true) });

    await authMiddleware(createTo('/login'), {} as MiddlewareFrom);

    expect(mockNavigateTo).toHaveBeenCalledWith('/tabs/home');
  });

  it('redirects authenticated users away from root', async () => {
    mockUseAuth.mockReturnValue({ loggedIn: ref(true) });

    await authMiddleware(createTo('/'), {} as MiddlewareFrom);

    expect(mockNavigateTo).toHaveBeenCalledWith('/tabs/home');
  });

  it('allows authenticated users on non-login routes', async () => {
    mockUseAuth.mockReturnValue({ loggedIn: ref(true) });

    const result = await authMiddleware(createTo('/tabs/tasks'), {} as MiddlewareFrom);

    expect(result).toBeUndefined();
    expect(mockNavigateTo).not.toHaveBeenCalled();
  });

  it('allows unauthenticated users when route meta permits it', async () => {
    const result = await authMiddleware(createTo('/register', true), {} as MiddlewareFrom);

    expect(result).toBeUndefined();
    expect(mockNavigateTo).not.toHaveBeenCalled();
  });

  it('redirects unauthenticated users to login for protected routes', async () => {
    await authMiddleware(createTo('/tabs/tasks'), {} as MiddlewareFrom);

    expect(mockNavigateTo).toHaveBeenCalledWith('/login');
  });
});
