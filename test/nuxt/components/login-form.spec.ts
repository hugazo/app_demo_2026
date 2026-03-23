import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginForm from '@/components/login-form.vue';
import { EmailSignInHandlerKey } from '@/composables/useAuth';

describe('LoginForm', () => {
  const mockHandleEmailSignIn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = () => {
    const wrapper = mount(LoginForm, {
      global: {
        provide: {
          [EmailSignInHandlerKey as symbol]: mockHandleEmailSignIn,
        },
      },
    });
    return wrapper as typeof wrapper & { vm: { email: string; password: string } };
  };

  it('renders email and password inputs and a login button', () => {
    const wrapper = mountComponent();

    const inputs = wrapper.findAll('ion-input');
    expect(inputs).toHaveLength(2);
    expect(wrapper.find('ion-button').text()).toContain('Login');
  });

  it('calls handleEmailSignIn with form values on button click', async () => {
    const wrapper = mountComponent();

    wrapper.vm.email = 'user@example.com';
    wrapper.vm.password = 'secret123';
    await nextTick();

    await wrapper.find('ion-button').trigger('click');

    expect(mockHandleEmailSignIn).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret123',
      callbackURL: undefined,
      rememberMe: false,
    });
  });

  it('calls handleEmailSignIn on Enter keyup in password field', async () => {
    const wrapper = mountComponent();

    wrapper.vm.email = 'enter@example.com';
    wrapper.vm.password = 'enterpass';
    await nextTick();

    const passwordInput = wrapper.findAll('ion-input')[1]!;
    await passwordInput.trigger('keyup.enter');

    expect(mockHandleEmailSignIn).toHaveBeenCalledWith({
      email: 'enter@example.com',
      password: 'enterpass',
      callbackURL: undefined,
      rememberMe: false,
    });
  });

  it('submits default empty form values when no input is provided', async () => {
    const wrapper = mountComponent();

    await wrapper.find('ion-button').trigger('click');

    expect(mockHandleEmailSignIn).toHaveBeenCalledWith({
      email: '',
      password: '',
      callbackURL: undefined,
      rememberMe: false,
    });
  });
});
