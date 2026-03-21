import { setActivePinia, createPinia } from 'pinia';
import { appState as useAppState } from '@/stores/app';
import { useAppStatus } from '@/composables/useAppStatus';
import { it, describe, expect, beforeEach, vi } from 'vitest';

vi.mock('@capacitor/splash-screen', () => ({
  SplashScreen: {
    hide: vi.fn(),
  },
}));

const mockLoadSession = vi.fn();
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    loadSession: mockLoadSession,
  }),
}));

describe('useAppStatus composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should return initialized as false by default', () => {
    const { initialized } = useAppStatus();
    expect(initialized.value).toBe(false);
  });

  it('should set initialized via setInitialized', () => {
    const { initialized, setInitialized } = useAppStatus();
    setInitialized(true);
    expect(initialized.value).toBe(true);
  });

  it('should update the store when setInitialized is called', () => {
    const { setInitialized } = useAppStatus();
    const store = useAppState();
    setInitialized(true);
    expect(store.initialized).toBe(true);
  });

  it('should call loadSession and set initialized on initializeApp', async () => {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    const { initialized, initializeApp } = useAppStatus();

    await initializeApp();

    expect(mockLoadSession).toHaveBeenCalledOnce();
    expect(initialized.value).toBe(true);
    expect(SplashScreen.hide).toHaveBeenCalledOnce();
  });

  it('should not re-initialize if already initialized', async () => {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    const { initializeApp, setInitialized } = useAppStatus();

    setInitialized(true);
    await initializeApp();

    expect(mockLoadSession).not.toHaveBeenCalled();
    expect(SplashScreen.hide).not.toHaveBeenCalled();
  });
});
