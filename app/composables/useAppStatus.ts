import { SplashScreen } from '@capacitor/splash-screen';

export const useAppStatus = () => {
  const {
    initialized,
  } = storeToRefs(appState());

  const { loadSession } = useAuth();

  const setInitialized = (value: boolean) => {
    initialized.value = value;
  };

  const initializeApp = async () => {
    if (initialized.value) return;
    await loadSession();
    setInitialized(true);
    await SplashScreen.hide();
  };

  return {
    initialized,
    setInitialized,
    initializeApp,
  };
};
