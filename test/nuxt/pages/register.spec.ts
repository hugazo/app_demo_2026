import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RegisterPage from '@/pages/register.vue';

const mockSignUpEmail = vi.fn();
const mockUseAuthClient = vi.hoisted(() => vi.fn());

mockNuxtImport('useAuthClient', () => mockUseAuthClient);

type RegisterVm = {
  name: string;
  email: string;
  password: string;
  handleRegister: () => Promise<void>;
};

type RegisterWrapper = ReturnType<typeof mount> & { vm: RegisterVm };

const ionInputStub = {
  name: 'ion-input',
  template: '<input />',
  props: ['modelValue'],
  emits: ['update:modelValue'],
};

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NODE_ENV', 'development');

    mockUseAuthClient.mockReturnValue({
      signUp: {
        email: mockSignUpEmail,
      },
    });
  });

  const mountComponent = (options?: { stubInputs?: boolean }): RegisterWrapper =>
    mount(RegisterPage, {
      global: {
        stubs: options?.stubInputs
          ? {
              'ion-input': ionInputStub,
            }
          : undefined,
      },
    }) as RegisterWrapper;

  it('renders title, 3 inputs, and register button', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('ion-title').text()).toBe('Register Page');
    expect(wrapper.findAll('ion-input')).toHaveLength(3);
    expect(wrapper.find('ion-button').text()).toBe('Register');
  });

  it('throws when outside development environment', () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(() => mountComponent()).toThrow('Developer tab should only be accessible in development environment');
  });

  it('calls signUp.email with form values on register click', async () => {
    const wrapper = mountComponent();

    wrapper.vm.name = 'Jane Doe';
    wrapper.vm.email = 'jane@example.com';
    wrapper.vm.password = 'password123';
    await nextTick();

    mockSignUpEmail.mockResolvedValue({ user: { id: '1' } });

    await wrapper.find('ion-button').trigger('click');

    expect(mockSignUpEmail).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });
  });

  it('submits empty values by default', async () => {
    const wrapper = mountComponent();

    mockSignUpEmail.mockResolvedValue({ user: { id: '1' } });

    await wrapper.find('ion-button').trigger('click');

    expect(mockSignUpEmail).toHaveBeenCalledWith({
      name: '',
      email: '',
      password: '',
    });
  });

  it('updates reactive fields from ion-input v-model events', async () => {
    const wrapper = mountComponent({ stubInputs: true });
    const inputs = wrapper.findAllComponents({ name: 'ion-input' });

    inputs[0]!.vm.$emit('update:modelValue', 'Alice');
    inputs[1]!.vm.$emit('update:modelValue', 'alice@example.com');
    inputs[2]!.vm.$emit('update:modelValue', 'secure');
    await nextTick();

    expect(wrapper.vm.name).toBe('Alice');
    expect(wrapper.vm.email).toBe('alice@example.com');
    expect(wrapper.vm.password).toBe('secure');
  });
});
