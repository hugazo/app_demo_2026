import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import authPlugin from '@/plugins/auth.client';

const mockInitializeApp = vi.hoisted(() => vi.fn());
const mockUseAppStatus = vi.hoisted(() => vi.fn());

mockNuxtImport('useAppStatus', () => mockUseAppStatus);

describe('auth.client plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInitializeApp.mockResolvedValue(undefined);
    mockUseAppStatus.mockReturnValue({
      initializeApp: mockInitializeApp,
    });
  });

  it('calls initializeApp on execution', async () => {
    await authPlugin(useNuxtApp());

    expect(mockUseAppStatus).toHaveBeenCalledOnce();
    expect(mockInitializeApp).toHaveBeenCalledOnce();
  });
});
