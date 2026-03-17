import type {
  InferSessionFromClient,
  BetterAuthClientOptions,
  User,
} from 'better-auth/client';
import { setActivePinia, createPinia } from 'pinia';
import { authState as useAuthState } from '@/stores/auth';
import { it, describe, expect, beforeEach } from 'vitest';

describe('Auth State', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default values', () => {
    const authState = useAuthState();
    expect(authState.session).toBeNull();
    expect(authState.user).toBeNull();
    expect(authState.authInitialized).toBe(false);
    expect(authState.sessionLoading).toBe(false);
  });

  it('should update session', () => {
    const authState = useAuthState();
    const mockSession: InferSessionFromClient<BetterAuthClientOptions> = {
      id: 'session1',
      userId: 'test@whatever.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      token: 'abc123',
      expiresAt: new Date(),
    };
    authState.session = mockSession;
    expect(authState.session).toEqual(mockSession);
  });

  it('should update user', () => {
    const authState = useAuthState();
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: true,
      image: null,
    };
    authState.user = mockUser;
    expect(authState.user).toEqual(mockUser);
  });

  it('should update authInitialized', () => {
    const authState = useAuthState();
    authState.authInitialized = true;
    expect(authState.authInitialized).toBe(true);
  });

  it('should update sessionLoading', () => {
    const authState = useAuthState();
    authState.sessionLoading = true;
    expect(authState.sessionLoading).toBe(true);
  });
});
