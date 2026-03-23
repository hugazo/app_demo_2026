import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Id } from '@convex/_generated/dataModel';
import DismissButton from '@/components/task/dismiss-button.vue';
import { TaskDismissHandlerKey } from '@/composables/useTasks';

describe('DismissButton', () => {
  const mockHandleTaskDismiss = vi.fn();
  const taskId = 'task_123' as Id<'tasks'>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = () =>
    mount(DismissButton, {
      props: { taskId },
      global: {
        provide: {
          [TaskDismissHandlerKey as symbol]: mockHandleTaskDismiss,
        },
      },
    });

  it('renders an item option with a trash icon', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('ion-item-option').exists()).toBe(true);
    expect(wrapper.find('ion-icon').exists()).toBe(true);
  });

  it('calls handleTaskDismiss with the task id on click', async () => {
    const wrapper = mountComponent();

    await wrapper.find('ion-item-option').trigger('click');

    expect(mockHandleTaskDismiss).toHaveBeenCalledWith({ taskId });
  });
});
