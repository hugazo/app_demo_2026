export default defineNuxtRouteMiddleware(async (to, _from) => {
  // Allows Plugin to Initialize

  const nuxtApp = useNuxtApp();
  const pinia = usePinia();

  if (
    (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered)
    || import.meta.server
    || pinia === undefined
  ) return;

  const homePath = '/tabs/home';
  const loginPath = '/login';

  const { loggedIn } = useAuth();

  if (loggedIn.value) {
    if (
      to.path === loginPath
      || to.path === '/'
    ) {
      return navigateTo(homePath);
    }
    return;
  }

  if (to.meta.allowUnauthenticated) {
    return;
  }

  return navigateTo(loginPath);
});
