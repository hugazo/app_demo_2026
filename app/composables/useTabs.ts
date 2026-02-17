import { useRouter } from 'vue-router';
import { useIonRouter } from '#imports';
import { homeOutline, listOutline, cogOutline, bugOutline, helpCircleOutline } from 'ionicons/icons';

export const useTabs = () => {
  const appRouter = useRouter();
  const ionRouter = useIonRouter();

  const routes = appRouter.getRoutes();

  const RouteIcons = {
    home: homeOutline,
    tasks: listOutline,
    settings: cogOutline,
    developer: bugOutline,
    default: helpCircleOutline,
  };

  const tabLinks = computed(() => {
    return routes
      .find(route => route.name === 'tabs')?.children
      .sort((a, b) => (a.meta?.priority || 10) - (b.meta?.priority || 10))
      .filter(route => route.meta?.onlyDev && process.env.NODE_ENV !== 'development' ? false : true)
      .map((route) => {
        const icon = RouteIcons[route.path as keyof typeof RouteIcons] || RouteIcons.default;
        return {
          ...route,
          icon,
        };
      });
  });

  const handleTabChange = (tabName: string) => {
    const targetTabIndex = tabLinks.value?.findIndex(tab => tab.path === tabName);
    const currentRoute = appRouter.currentRoute.value;
    const currentTabIndex = tabLinks.value?.findIndex(tab => currentRoute.name === tab.name);

    if (
      targetTabIndex === undefined
      || currentTabIndex === undefined
      || (targetTabIndex === currentTabIndex)
    ) {
      return;
    }

    const direction = targetTabIndex > currentTabIndex ? 'forward' : 'back';
    const routeAction = targetTabIndex > currentTabIndex ? 'push' : 'pop';

    ionRouter.navigate(`/tabs/${tabName}`, direction, routeAction);
  };

  return {
    tabLinks,
    handleTabChange,
  };
};
