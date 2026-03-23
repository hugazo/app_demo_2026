import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Id } from '@convex/_generated/dataModel';
import EditButton from '@/components/task/edit-button.vue';
import { OpenTaskModalHandlerKey } from '@/composables/useTasks';

describe('EditButton', () => {
  const mockHandleOpenTaskModal = vi.fn();
  const taskId = 'task_456' as Id<'tasks'>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = () =>
    mount(EditButton, {
      props: { taskId },
      global: {
        provide: {
          [OpenTaskModalHandlerKey as symbol]: mockHandleOpenTaskModal,
        },
      },
    });

  it('renders an item option with a pencil icon', () => {
    const wrapper = mountComponent();

    expect(wrapper.find('ion-item-option').exists()).toBe(true);
    expect(wrapper.find('ion-icon').exists()).toBe(true);
  });

  it('calls handleOpenTaskModal with the task id on click', async () => {
    const wrapper = mountComponent();

    await wrapper.find('ion-item-option').trigger('click');

    expect(mockHandleOpenTaskModal).toHaveBeenCalledWith(taskId);
  });
});
