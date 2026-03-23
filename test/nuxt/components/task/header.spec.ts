import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TaskHeader from '@/components/task/header.vue';
import { TaskCountKey, TasksPendingKey, OpenTaskModalHandlerKey } from '@/composables/useTasks';

describe('TaskHeader', () => {
  const mockHandleOpenTaskModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = (isPending: boolean, taskCount: number) =>
    mount(TaskHeader, {
      global: {
        provide: {
          [TaskCountKey as symbol]: computed(() => taskCount),
          [TasksPendingKey as symbol]: computed(() => isPending),
          [OpenTaskModalHandlerKey as symbol]: mockHandleOpenTaskModal,
        },
      },
    });

  it('shows loading text in title when pending', () => {
    const wrapper = mountComponent(true, 0);

    expect(wrapper.find('ion-title').text()).toContain('Loading...');
  });

  it('shows task count in title when not pending', () => {
    const wrapper = mountComponent(false, 5);

    expect(wrapper.find('ion-title').text()).toContain('(5)');
    expect(wrapper.find('ion-title').text()).not.toContain('Loading...');
  });

  it('renders an Add Task button', () => {
    const wrapper = mountComponent(false, 0);

    expect(wrapper.find('ion-button').text()).toContain('Add Task');
  });

  it('calls handleOpenTaskModal with undefined on Add Task click', async () => {
    const wrapper = mountComponent(false, 0);

    await wrapper.find('ion-button').trigger('click');

    expect(mockHandleOpenTaskModal).toHaveBeenCalledWith(undefined);
  });
});
