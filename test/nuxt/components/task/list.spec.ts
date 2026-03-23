import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Id } from '@convex/_generated/dataModel';
import TaskList from '@/components/task/list.vue';
import { TaskToggleHandlerKey, TaskDismissHandlerKey, OpenTaskModalHandlerKey } from '@/composables/useTasks';
import type { Task } from '@/composables/useTasks';

const tasks: Task[] = [
  { _id: 'task_1' as Id<'tasks'>, _creationTime: 0, owner: 'u1', text: 'Buy milk', isCompleted: false },
  { _id: 'task_2' as Id<'tasks'>, _creationTime: 0, owner: 'u1', text: 'Walk dog', isCompleted: true },
];

describe('TaskList', () => {
  const mockHandleTaskToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = (taskProps: Task[] = tasks) =>
    mount(TaskList, {
      props: { tasks: taskProps },
      global: {
        provide: {
          [TaskToggleHandlerKey as symbol]: mockHandleTaskToggle,
          [TaskDismissHandlerKey as symbol]: vi.fn(),
          [OpenTaskModalHandlerKey as symbol]: vi.fn(),
        },
        stubs: {
          'task-dismiss-button': true,
          'task-edit-button': true,
        },
      },
    });

  it('renders a sliding item for each task', () => {
    const wrapper = mountComponent();

    expect(wrapper.findAll('ion-item-sliding')).toHaveLength(2);
  });

  it('displays task text inside toggles', () => {
    const wrapper = mountComponent();

    const toggles = wrapper.findAll('ion-toggle');
    expect(toggles[0]!.text()).toContain('Buy milk');
    expect(toggles[1]!.text()).toContain('Walk dog');
  });

  it('renders empty list when no tasks provided', () => {
    const wrapper = mountComponent([]);

    expect(wrapper.findAll('ion-item-sliding')).toHaveLength(0);
  });

  it('calls handleTaskToggle with task id and checked state on ionChange', async () => {
    const wrapper = mountComponent();

    const toggle = wrapper.findAll('ion-toggle')[0]!;
    await toggle.trigger('ionChange', { detail: { checked: true } });

    expect(mockHandleTaskToggle).toHaveBeenCalledWith({ id: 'task_1', isCompleted: true });
  });
});
