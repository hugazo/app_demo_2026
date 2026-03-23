import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AppRoot from '@/app.vue';

const mockUseAppStatus = vi.hoisted(() => vi.fn());

mockNuxtImport('useAppStatus', () => mockUseAppStatus);

describe('AppRoot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = () =>
    mount(AppRoot, {
      global: {
        stubs: {
          'loader-loading-page': true,
          'ion-router-outlet': true,
        },
      },
    });

  it('renders loading page when app is not initialized', () => {
    mockUseAppStatus.mockReturnValue({ initialized: ref(false) });

    const wrapper = mountComponent();

    expect(wrapper.findComponent({ name: 'loader-loading-page' }).exists()).toBe(true);
    expect(wrapper.find('ion-router-outlet-stub').exists()).toBe(false);
  });

  it('renders router outlet when app is initialized', () => {
    mockUseAppStatus.mockReturnValue({ initialized: ref(true) });

    const wrapper = mountComponent();

    expect(wrapper.findComponent({ name: 'loader-loading-page' }).exists()).toBe(false);
    expect(wrapper.find('ion-router-outlet-stub').exists()).toBe(true);
  });
});
