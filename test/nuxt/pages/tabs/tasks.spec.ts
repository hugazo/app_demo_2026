import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ComponentInternalInstance } from 'vue';
import TasksPage from '@/pages/tabs/tasks.vue';
import {
  TaskCountKey,
  TasksPendingKey,
  CompletedTasksKey,
  PendingTasksKey,
  TaskToggleHandlerKey,
  TaskDismissHandlerKey,
  OpenTaskModalKey,
  TaskNameKey,
  FormErrorKey,
  NewTaskHandlerKey,
  CurrentTaskKey,
  OpenTaskModalHandlerKey,
  TaskEditHandlerKey,
  ResetTaskFormKey,
} from '@/composables/useTasks';
import { LogoutHandlerKey } from '@/composables/useAuth';

type InstanceWithProvides = ComponentInternalInstance & { provides: Record<string | symbol, unknown> };

const mockHandleLogout = vi.fn();
const mockHandleOpenTaskModal = vi.fn();
const mockHandleTaskToggle = vi.fn();
const mockHandleTaskDismiss = vi.fn();
const mockHandleNewTask = vi.fn();
const mockHandleTaskEdit = vi.fn();
const mockResetForm = vi.fn();

const mockUseAuth = vi.hoisted(() => vi.fn());
const mockUseTasks = vi.hoisted(() => vi.fn());

mockNuxtImport('useAuth', () => mockUseAuth);
mockNuxtImport('useTasks', () => mockUseTasks);

describe('TasksPage', () => {
  let taskCount: ComputedRef<number>;
  let isPending: Ref<boolean>;
  let completedTasks: ComputedRef<never[]>;
  let pendingTasks: ComputedRef<never[]>;
  let openTaskModal: Ref<boolean>;
  let taskName: Ref<string>;
  let formError: Ref<string | null>;
  let currentTask: Ref<null>;

  beforeEach(() => {
    vi.clearAllMocks();

    taskCount = computed(() => 0);
    isPending = ref(false);
    completedTasks = computed(() => []);
    pendingTasks = computed(() => []);
    openTaskModal = ref(false);
    taskName = ref('');
    formError = ref(null);
    currentTask = ref(null);

    mockUseAuth.mockReturnValue({ handleLogout: mockHandleLogout, loggedIn: ref(true) });
    mockUseTasks.mockReturnValue({
      taskCount,
      isPending,
      completedTasks,
      pendingTasks,
      handleTaskToggle: mockHandleTaskToggle,
      handleTaskDismiss: mockHandleTaskDismiss,
      openTaskModal,
      taskName,
      formError,
      handleNewTask: mockHandleNewTask,
      currentTask,
      handleOpenTaskModal: mockHandleOpenTaskModal,
      handleTaskEdit: mockHandleTaskEdit,
      $resetForm: mockResetForm,
    });
  });

  const mountComponent = () =>
    mount(TasksPage, {
      global: {
        stubs: {
          'task-header': true,
          'task-content': true,
          'task-modal': true,
        },
      },
    });

  it('renders the three task child components', () => {
    const wrapper = mountComponent();

    expect(wrapper.findComponent({ name: 'task-header' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'task-content' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'task-modal' }).exists()).toBe(true);
  });

  it('provides handleLogout under LogoutHandlerKey', () => {
    const wrapper = mountComponent();
    const provides = (wrapper.vm.$ as InstanceWithProvides).provides;

    expect(provides[LogoutHandlerKey as symbol]).toBe(mockHandleLogout);
  });

  it('provides task data under their injection keys', () => {
    const wrapper = mountComponent();
    const provides = (wrapper.vm.$ as InstanceWithProvides).provides;

    expect(provides[TaskCountKey as symbol]).toBe(taskCount);
    expect(provides[TasksPendingKey as symbol]).toBe(isPending);
    expect(provides[CompletedTasksKey as symbol]).toBe(completedTasks);
    expect(provides[PendingTasksKey as symbol]).toBe(pendingTasks);
  });

  it('provides task handlers under their injection keys', () => {
    const wrapper = mountComponent();
    const provides = (wrapper.vm.$ as InstanceWithProvides).provides;

    expect(provides[TaskToggleHandlerKey as symbol]).toBe(mockHandleTaskToggle);
    expect(provides[TaskDismissHandlerKey as symbol]).toBe(mockHandleTaskDismiss);
    expect(provides[OpenTaskModalHandlerKey as symbol]).toBe(mockHandleOpenTaskModal);
    expect(provides[NewTaskHandlerKey as symbol]).toBe(mockHandleNewTask);
    expect(provides[TaskEditHandlerKey as symbol]).toBe(mockHandleTaskEdit);
    expect(provides[ResetTaskFormKey as symbol]).toBe(mockResetForm);
  });

  it('provides modal state under their injection keys', () => {
    const wrapper = mountComponent();
    const provides = (wrapper.vm.$ as InstanceWithProvides).provides;

    expect(provides[OpenTaskModalKey as symbol]).toBe(openTaskModal);
    expect(provides[TaskNameKey as symbol]).toBe(taskName);
    expect(provides[FormErrorKey as symbol]).toBe(formError);
    expect(provides[CurrentTaskKey as symbol]).toBe(currentTask);
  });
});
