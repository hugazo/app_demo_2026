import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentInternalInstance } from 'vue';
import HomePage from '@/pages/tabs/home.vue';
import { LogoutHandlerKey } from '@/composables/useAuth';

type InstanceWithProvides = ComponentInternalInstance & { provides: Record<string | symbol, unknown> };

const mockHandleLogout = vi.fn();
const mockUseAuth = vi.hoisted(() => vi.fn());

mockNuxtImport('useAuth', () => mockUseAuth);

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({ handleLogout: mockHandleLogout, loggedIn: ref(true) });
  });

  const mountComponent = () =>
    mount(HomePage, {
      global: {
        stubs: { 'auth-signout-button': true },
      },
    });

  it('renders the Home Page title', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('ion-title').text()).toBe('Home Page');
  });

  it('renders the signout button', () => {
    const wrapper = mountComponent();

    expect(wrapper.findComponent({ name: 'auth-signout-button' }).exists()).toBe(true);
  });

  it('provides handleLogout under LogoutHandlerKey', () => {
    const wrapper = mountComponent();
    const provides = (wrapper.vm.$ as InstanceWithProvides).provides;

    expect(provides[LogoutHandlerKey as symbol]).toBe(mockHandleLogout);
  });
});
