import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TaskContent from '@/components/task/content.vue';
import { TasksPendingKey, TaskCountKey } from '@/composables/useTasks';

describe('TaskContent', () => {
  const mountComponent = (isPending: boolean, taskCount: number) =>
    mount(TaskContent, {
      global: {
        provide: {
          [TasksPendingKey as symbol]: computed(() => isPending),
          [TaskCountKey as symbol]: computed(() => taskCount),
        },
        stubs: {
          'task-accordion': true,
        },
      },
    });

  it('shows loading text when pending', () => {
    const wrapper = mountComponent(true, 0);

    expect(wrapper.text()).toContain('Loading...');
    expect(wrapper.text()).not.toContain('No tasks!');
    expect(wrapper.find('task-accordion').exists()).toBe(false);
  });

  it('shows empty message when not pending and no tasks', () => {
    const wrapper = mountComponent(false, 0);

    expect(wrapper.text()).toContain('No tasks!');
    expect(wrapper.text()).not.toContain('Loading...');
    expect(wrapper.find('task-accordion').exists()).toBe(false);
  });

  it('renders task-accordion when not pending and tasks exist', () => {
    const wrapper = mountComponent(false, 3);

    expect(wrapper.findComponent({ name: 'TaskAccordion' }).exists()).toBe(true);
    expect(wrapper.text()).not.toContain('Loading...');
    expect(wrapper.text()).not.toContain('No tasks!');
  });
});
