import { toastController } from "#imports";

export default () => {
  const duration = 2000;
  const position = 'top' as const;

  const successToast = async (message: MaybeRefOrGetter<string>) => {
    const value = toValue(message);
    const toast = await toastController.create({
      message: value,
      duration,
      position,
      color: 'success',
    });

    await toast.present();
  };

  const errorToast = async (message: MaybeRefOrGetter<string>) => {
    const value = toValue(message);
    const toast = await toastController.create({
      message: value,
      duration,
      position,
      color: 'danger',
    });

    await toast.present();
  };
  
  return {
    successToast,
    errorToast,
  };
};