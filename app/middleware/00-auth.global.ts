export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (import.meta.server) return;
  const router = useIonRouter();

  const homePath = '/tabs/home';
  const loginPath = '/login';

  if (to.path === '/') {
    return router.push(homePath);
  }

  const { loggedIn, loadSession } = useAuth();
  await loadSession();

  if (!loggedIn.value) {
    if (to.meta.allowUnauthenticated) {
      return;
    }
    return router.push(loginPath);
  }

  if (to.path === loginPath) {
    return router.push(homePath);
  }
  return;
});
