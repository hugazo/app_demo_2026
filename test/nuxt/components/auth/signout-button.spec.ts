import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SignoutButton from '@/components/auth/signout-button.vue';
import { LogoutHandlerKey } from '@/composables/useAuth';

describe('SignoutButton', () => {
  const mockHandleLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = () =>
    mount(SignoutButton, {
      global: {
        provide: {
          [LogoutHandlerKey as symbol]: mockHandleLogout,
        },
      },
    });

  it('renders a logout button', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('ion-button').text()).toContain('Logout');
  });

  it('calls handleLogout on button click', async () => {
    const wrapper = mountComponent();

    await wrapper.find('ion-button').trigger('click');

    expect(mockHandleLogout).toHaveBeenCalledOnce();
  });
});
