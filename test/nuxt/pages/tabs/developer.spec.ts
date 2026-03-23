import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DeveloperPage from '@/pages/tabs/developer.vue';

describe('DeveloperPage', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development');
  });

  const mountComponent = () => mount(DeveloperPage);

  it('renders the Developer Tab heading', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('h1').text()).toBe('Developer Tab');
  });

  it('renders the Developer Tab description', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('p').text()).toBe('This is the Developer tab content.');
  });

  it('throws when rendered outside development environment', () => {
    vi.stubEnv('NODE_ENV', 'production');

    expect(() => mountComponent()).toThrow('Developer tab should only be accessible in development environment');
  });
});
