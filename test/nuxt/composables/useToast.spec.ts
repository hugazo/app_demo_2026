import { toastController } from '#imports';
import { it, describe, expect, beforeEach, vi } from 'vitest';

describe('useToast composable', () => {
  const mockPresent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(toastController, 'create').mockResolvedValue({ present: mockPresent } as any);
  });

  it('should create a success toast with correct options', async () => {
    const { successToast } = useToast();
    await successToast('Operation successful');

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Operation successful',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    expect(mockPresent).toHaveBeenCalledOnce();
  });

  it('should create an error toast with correct options', async () => {
    const { errorToast } = useToast();
    await errorToast('Something went wrong');

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Something went wrong',
      duration: 2000,
      position: 'top',
      color: 'danger',
    });
    expect(mockPresent).toHaveBeenCalledOnce();
  });

  it('should resolve ref values for successToast', async () => {
    const { successToast } = useToast();
    const message = ref('Ref message');
    await successToast(message);

    expect(toastController.create).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Ref message' }),
    );
  });

  it('should resolve ref values for errorToast', async () => {
    const { errorToast } = useToast();
    const message = ref('Ref error');
    await errorToast(message);

    expect(toastController.create).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Ref error' }),
    );
  });

  it('should resolve getter values for successToast', async () => {
    const { successToast } = useToast();
    await successToast(() => 'Getter message');

    expect(toastController.create).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Getter message' }),
    );
  });
});
