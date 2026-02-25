export default defineNuxtRouteMiddleware(async (to, _from) => {
  // Allows Plugin to Initialize
  const nuxtApp = useNuxtApp();
  if (
    (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered)
    || import.meta.server
  ) return;

  const homePath = '/tabs/home';
  const loginPath = '/login';

  const { session } = authState();

  const loggedIn = !!session?.token;

  if (loggedIn) {
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
