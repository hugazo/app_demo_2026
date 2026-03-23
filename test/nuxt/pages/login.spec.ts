import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentInternalInstance } from 'vue';
import LoginPage from '@/pages/login.vue';
import { EmailSignInHandlerKey } from '@/composables/useAuth';

type InstanceWithProvides = ComponentInternalInstance & { provides: Record<string | symbol, unknown> };

const mockHandleEmailSignIn = vi.fn();
const mockUseAuth = vi.hoisted(() => vi.fn());

mockNuxtImport('useAuth', () => mockUseAuth);

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      handleEmailSignIn: mockHandleEmailSignIn,
      loggedIn: ref(false),
    });
  });

  const mountComponent = () => mount(LoginPage, {
    global: {
      stubs: { 'login-form': true },
    },
  });

  it('renders the Login Page title', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('ion-title').text()).toBe('Login Page');
  });

  it('renders a login-form', () => {
    const wrapper = mountComponent();

    expect(wrapper.findComponent({ name: 'login-form' }).exists()).toBe(true);
  });

  it('provides handleEmailSignIn under EmailSignInHandlerKey', () => {
    const wrapper = mountComponent();

    expect((wrapper.vm.$ as InstanceWithProvides).provides[EmailSignInHandlerKey as symbol]).toBe(mockHandleEmailSignIn);
  });
});
