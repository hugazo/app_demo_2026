import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Id } from '@convex/_generated/dataModel';
import TaskAccordion from '@/components/task/task-accordion.vue';
import { PendingTasksKey, CompletedTasksKey } from '@/composables/useTasks';
import type { Task } from '@/composables/useTasks';

const makeTasks = (count: number, completed: boolean): Task[] =>
  Array.from({ length: count }, (_, i) => ({
    _id: `task_${completed ? 'c' : 'p'}_${i}` as Id<'tasks'>,
    _creationTime: i,
    owner: 'u1',
    text: `Task ${i}`,
    isCompleted: completed,
  })) as Task[];

describe('TaskAccordion', () => {
  let pendingTasks: ComputedRef<Task[]>;
  let completedTasks: ComputedRef<Task[]>;

  beforeEach(() => {
    vi.clearAllMocks();

    pendingTasks = computed(() => makeTasks(2, false));
    completedTasks = computed(() => makeTasks(3, true));
  });

  const mountComponent = () =>
    mount(TaskAccordion, {
      global: {
        provide: {
          [PendingTasksKey as symbol]: pendingTasks,
          [CompletedTasksKey as symbol]: completedTasks,
        },
        stubs: {
          'task-list': true,
        },
      },
    });

  it('renders two accordion sections', () => {
    const wrapper = mountComponent();

    expect(wrapper.findAll('ion-accordion')).toHaveLength(2);
  });

  it('shows "Todo" and "Completed" headers', () => {
    const wrapper = mountComponent();

    const labels = wrapper.findAll('ion-label');
    expect(labels[0]!.text()).toBe('Todo');
    expect(labels[1]!.text()).toBe('Completed');
  });

  it('shows task count badges', () => {
    const wrapper = mountComponent();

    const badges = wrapper.findAll('ion-badge');
    expect(badges[0]!.text()).toBe('2');
    expect(badges[1]!.text()).toBe('3');
  });

  it('passes tasks to each task-list stub', () => {
    const wrapper = mountComponent();

    const taskLists = wrapper.findAllComponents({ name: 'task-list' });
    expect(taskLists[0]!.props('tasks')).toHaveLength(2);
    expect(taskLists[1]!.props('tasks')).toHaveLength(3);
  });
});
