export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (import.meta.server) return;

  const router = useIonRouter();

  const homePath = '/';
  const loginPath = '/login';

  const { loggedIn, loadSession } = useAuth();
  await loadSession();

  console.log('Auth middleware - loggedIn:', loggedIn.value, to.path);

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
