import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SettingsPage from '@/pages/tabs/settings.vue';

describe('SettingsPage', () => {
  const mountComponent = () => mount(SettingsPage);

  it('renders the settings title', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('ion-title').text()).toBe('Settings');
  });

  it('renders the settings content text', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('ion-content').text()).toContain('Settings content');
  });
});
