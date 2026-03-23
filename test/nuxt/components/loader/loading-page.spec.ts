import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import LoadingPage from '@/components/loader/loading-page.vue';

describe('LoadingPage', () => {
  it('renders an ion-spinner inside a spinner-container', () => {
    const wrapper = mount(LoadingPage);

    expect(wrapper.find('.spinner-container ion-spinner').exists()).toBe(true);
  });
});
