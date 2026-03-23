import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import LoadingPage from '@/components/loader/loading-page.vue';

describe('LoadingPage', () => {
  it('renders an ion-spinner', () => {
    const wrapper = mount(LoadingPage);

    expect(wrapper.find('ion-spinner').exists()).toBe(true);
  });

  it('wraps the spinner in a spinner-container div', () => {
    const wrapper = mount(LoadingPage);

    expect(wrapper.find('.spinner-container ion-spinner').exists()).toBe(true);
  });
});
