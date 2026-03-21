import { it, describe, expect, beforeEach, vi } from 'vitest';
import { homeOutline, listOutline, cogOutline, bugOutline, helpCircleOutline } from 'ionicons/icons';
import { useTabs } from '../../../app/composables/useTabs';
import type { RouteMeta } from 'vue-router';

const mockNavigate = vi.fn();
vi.mock('@ionic/vue', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    useIonRouter: () => ({
      navigate: mockNavigate,
    }),
  };
});

const baseTabChildren = [
  { path: 'home', name: 'tabs-home', meta: { priority: 1 } },
  { path: 'tasks', name: 'tabs-tasks', meta: { priority: 2 } },
  { path: 'settings', name: 'tabs-settings', meta: { priority: 3 } },
  { path: 'developer', name: 'tabs-developer', meta: { onlyDev: true, priority: 10 } },
];

const tabChildren = [...baseTabChildren];
const routerRoutes = [{ name: 'tabs', children: tabChildren }];

const mockCurrentRoute = ref({ name: 'tabs-home', path: '/tabs/home' });

vi.mock('vue-router', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    useRouter: () => ({
      getRoutes: () => routerRoutes,
      currentRoute: mockCurrentRoute,
    }),
  };
});

describe('useTabs composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NODE_ENV', 'development');
    tabChildren.splice(0, tabChildren.length, ...baseTabChildren);
    routerRoutes.splice(0, routerRoutes.length, { name: 'tabs', children: tabChildren });
    mockCurrentRoute.value = { name: 'tabs-home', path: '/tabs/home' };
  });

  it('should return tabLinks sorted by priority with correct icons', () => {
    const { tabLinks } = useTabs();
    const links = tabLinks.value!;

    expect(links).toHaveLength(4);
    expect(links[0]).toBeDefined();
    expect(links[0]!.path).toBe('home');
    expect(links[0]!.icon).toBe(homeOutline);
    expect(links[1]).toBeDefined();
    expect(links[1]!.path).toBe('tasks');
    expect(links[1]!.icon).toBe(listOutline);
    expect(links[2]).toBeDefined();
    expect(links[2]!.path).toBe('settings');
    expect(links[2]!.icon).toBe(cogOutline);
    expect(links[3]).toBeDefined();
    expect(links[3]!.path).toBe('developer');
    expect(links[3]!.icon).toBe(bugOutline);
  });

  it('should filter out onlyDev tabs when not in development', () => {
    vi.stubEnv('NODE_ENV', 'production');

    const { tabLinks } = useTabs();
    const links = tabLinks.value!;

    expect(links).toHaveLength(3);
    expect(links.find(l => l.path === 'developer')).toBeUndefined();
  });

  it('should navigate forward when target tab is after current tab', () => {
    const { handleTabChange } = useTabs();
    handleTabChange('tasks');

    expect(mockNavigate).toHaveBeenCalledWith('/tabs/tasks', 'forward', 'push');
  });

  it('should navigate back when target tab is before current tab', () => {
    mockCurrentRoute.value = { name: 'tabs-settings', path: '/tabs/settings' };
    const { handleTabChange } = useTabs();
    handleTabChange('home');

    expect(mockNavigate).toHaveBeenCalledWith('/tabs/home', 'back', 'pop');
  });

  it('should not navigate when target tab is the current tab', () => {
    const { handleTabChange } = useTabs();
    handleTabChange('home');

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should still navigate when target tab is not found (findIndex returns -1)', () => {
    const { handleTabChange } = useTabs();
    handleTabChange('nonexistent');
    expect(mockNavigate).toHaveBeenCalledWith('/tabs/nonexistent', 'back', 'pop');
  });

  it('should use fallback priority and fallback icon when route metadata is missing', () => {
    tabChildren.splice(
      0,
      tabChildren.length,
      { path: 'mystery', name: 'tabs-mystery', meta: {} satisfies RouteMeta },
      { path: 'home', name: 'tabs-home', meta: { priority: 1 } satisfies RouteMeta },
      { path: 'tasks', name: 'tabs-tasks', meta: {} satisfies RouteMeta },
    );

    const { tabLinks } = useTabs();
    const links = tabLinks.value!;

    expect(links[0]).toBeDefined();
    expect(links[0]!.path).toBe('home');

    const mysteryTab = links.find(link => link.path === 'mystery');
    expect(mysteryTab).toBeDefined();
    expect(mysteryTab!.icon).toBe(helpCircleOutline);
  });

  it('should return undefined tabLinks and avoid navigation when tabs route does not exist', () => {
    routerRoutes.splice(0, routerRoutes.length, { name: 'other', children: [] });

    const { tabLinks, handleTabChange } = useTabs();
    handleTabChange('home');

    expect(tabLinks.value).toBeUndefined();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
