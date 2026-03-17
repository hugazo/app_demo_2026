import { setActivePinia, createPinia } from 'pinia';
import { appState as useAppState } from '@/stores/app';
import { it, describe, expect, beforeEach } from 'vitest';

describe('App State', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with default values', () => {
    const appState = useAppState();
    expect(appState.initialized).toBe(false);
  });

  it('should update initialized state', () => {
    const appState = useAppState();
    appState.initialized = true;
    expect(appState.initialized).toBe(true);
  });
});
