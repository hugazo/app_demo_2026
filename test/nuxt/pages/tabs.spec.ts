import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { homeOutline, listOutline, cogOutline } from 'ionicons/icons';
import TabsPage from '@/pages/tabs.vue';

const mockHandleTabChange = vi.fn();
const mockUseRoute = vi.fn();

const mockTabLinks = [
  { path: 'home', name: 'tabs-home', icon: homeOutline },
  { path: 'tasks', name: 'tabs-tasks', icon: listOutline },
  { path: 'settings', name: 'tabs-settings', icon: cogOutline },
];

mockNuxtImport('useTabs', () => () => ({
  tabLinks: computed(() => mockTabLinks),
  handleTabChange: mockHandleTabChange,
}));

vi.mock('vue-router', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    useRoute: () => mockUseRoute(),
  };
});

describe('TabsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRoute.mockReturnValue({ path: '/tabs/home' });
  });

  const mountComponent = () =>
    mount(TabsPage, {
      global: {
        stubs: {
          'ion-router-outlet': true,
        },
      },
    });

  it('renders a tab button for each tab link', () => {
    const wrapper = mountComponent();

    expect(wrapper.findAll('ion-tab-button')).toHaveLength(3);
  });

  it('renders the tab path label for each tab', () => {
    const wrapper = mountComponent();

    const labels = wrapper.findAll('ion-label');
    expect(labels[0]!.text()).toBe('home');
    expect(labels[1]!.text()).toBe('tasks');
    expect(labels[2]!.text()).toBe('settings');
  });

  it('marks the active tab as selected based on current route', () => {
    mockUseRoute.mockReturnValue({ path: '/tabs/tasks' });

    const wrapper = mountComponent();

    const buttons = wrapper.findAll('ion-tab-button');
    expect((buttons[0]!.element as HTMLIonTabButtonElement).selected).toBeFalsy();
    expect((buttons[1]!.element as HTMLIonTabButtonElement).selected).toBe(true);
    expect((buttons[2]!.element as HTMLIonTabButtonElement).selected).toBeFalsy();
  });

  it('calls handleTabChange with the tab path on click', async () => {
    const wrapper = mountComponent();

    await wrapper.findAll('ion-tab-button')[1]!.trigger('click');

    expect(mockHandleTabChange).toHaveBeenCalledWith('tasks');
  });
});
