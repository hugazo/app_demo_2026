import type { Id } from '@convex/_generated/dataModel';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { ConvexError } from 'convex/values';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTasks, type Task } from '@/composables/useTasks';

const mockUseConvexQuery = vi.hoisted(() => vi.fn());
const mockUseConvexMutation = vi.hoisted(() => vi.fn());

mockNuxtImport('useConvexQuery', () => mockUseConvexQuery);
mockNuxtImport('useConvexMutation', () => mockUseConvexMutation);

type TaskFixture = {
  _id: Id<'tasks'>;
  text: string;
  isCompleted: boolean;
};

const taskA: TaskFixture = {
  _id: 'task_a' as Id<'tasks'>,
  text: 'Buy milk',
  isCompleted: false,
};

const taskB: TaskFixture = {
  _id: 'task_b' as Id<'tasks'>,
  text: 'Walk dog',
  isCompleted: true,
};

const taskC: TaskFixture = {
  _id: 'task_c' as Id<'tasks'>,
  text: 'Read book',
  isCompleted: false,
};

describe('useTasks composable', () => {
  const mockToggle = vi.fn();
  const mockDismiss = vi.fn();
  const mockAdd = vi.fn();
  const mockEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const tasks = ref([taskA, taskB, taskC]);
    const isPending = ref(false);

    mockUseConvexQuery.mockReturnValue({
      data: tasks,
      isPending,
    });

    mockUseConvexMutation
      .mockReturnValueOnce({ mutate: mockToggle })
      .mockReturnValueOnce({ mutate: mockDismiss })
      .mockReturnValueOnce({ mutate: mockAdd })
      .mockReturnValueOnce({ mutate: mockEdit });
  });

  it('returns derived task lists and total count', () => {
    const { completedTasks, pendingTasks, taskCount, isPending } = useTasks();

    expect(isPending.value).toBe(false);
    expect(taskCount.value).toBe(3);
    expect(completedTasks.value).toEqual([taskB]);
    expect(pendingTasks.value).toEqual([taskA, taskC]);
  });

  it('returns empty derived values when tasks data is undefined', () => {
    mockUseConvexQuery.mockReturnValueOnce({
      data: ref(undefined),
      isPending: ref(true),
    });

    const { completedTasks, pendingTasks, taskCount, isPending } = useTasks();

    expect(isPending.value).toBe(true);
    expect(taskCount.value).toBe(0);
    expect(completedTasks.value).toEqual([]);
    expect(pendingTasks.value).toEqual([]);
  });

  it('opens modal for an existing task and pre-fills taskName', () => {
    const { handleOpenTaskModal, currentTask, taskName, openTaskModal } = useTasks();

    handleOpenTaskModal(taskB._id);

    expect(openTaskModal.value).toBe(true);
    expect(currentTask.value?._id).toBe(taskB._id);
    expect(taskName.value).toBe('Walk dog');
  });

  it('opens modal for a new task and clears current task state', () => {
    const { handleOpenTaskModal, currentTask, taskName, openTaskModal } = useTasks();

    handleOpenTaskModal();

    expect(openTaskModal.value).toBe(true);
    expect(currentTask.value).toBeNull();
    expect(taskName.value).toBe('');
  });

  it('opens modal with unknown task id and falls back to empty state', () => {
    const { handleOpenTaskModal, currentTask, taskName, openTaskModal } = useTasks();

    handleOpenTaskModal('missing_id' as Id<'tasks'>);

    expect(openTaskModal.value).toBe(true);
    expect(currentTask.value).toBeNull();
    expect(taskName.value).toBe('');
  });

  it('submits a new task and resets form state', async () => {
    const {
      handleNewTask,
      taskName,
      openTaskModal,
      currentTask,
      formError,
    } = useTasks();

    taskName.value = 'Write tests';
    openTaskModal.value = true;
    currentTask.value = taskA as Task;
    formError.value = 'Previous error';

    await handleNewTask();

    expect(mockAdd).toHaveBeenCalledOnce();
    expect(mockAdd).toHaveBeenCalledWith({ text: 'Write tests' });
    expect(taskName.value).toBe('');
    expect(openTaskModal.value).toBe(false);
    expect(currentTask.value).toBeNull();
    expect(formError.value).toBeNull();
  });

  it('stores ConvexError message when adding a task fails', async () => {
    mockAdd.mockRejectedValueOnce(new ConvexError({ message: 'Task text is required' }));

    const { handleNewTask, taskName, formError, openTaskModal } = useTasks();

    taskName.value = '';
    openTaskModal.value = true;

    await handleNewTask();

    expect(formError.value).toBe('Task text is required');
    expect(openTaskModal.value).toBe(true);
  });

  it('keeps formError unchanged when adding fails with a non-Convex error', async () => {
    mockAdd.mockRejectedValueOnce(new Error('network issue'));

    const { handleNewTask, formError } = useTasks();

    formError.value = 'Existing error';
    await handleNewTask();

    expect(formError.value).toBe('Existing error');
  });

  it('edits a task and resets form state', async () => {
    const {
      handleTaskEdit,
      taskName,
      openTaskModal,
      currentTask,
      formError,
    } = useTasks();

    taskName.value = 'Initial';
    openTaskModal.value = true;
    currentTask.value = taskA as Task;
    formError.value = 'Old error';

    await handleTaskEdit({ taskId: taskA._id, text: 'Updated task text' });

    expect(mockEdit).toHaveBeenCalledOnce();
    expect(mockEdit).toHaveBeenCalledWith({ taskId: taskA._id, text: 'Updated task text' });
    expect(taskName.value).toBe('');
    expect(openTaskModal.value).toBe(false);
    expect(currentTask.value).toBeNull();
    expect(formError.value).toBeNull();
  });

  it('stores ConvexError message when editing fails', async () => {
    mockEdit.mockRejectedValueOnce(new ConvexError({ message: 'Task not found' }));

    const { handleTaskEdit, formError, openTaskModal } = useTasks();

    openTaskModal.value = true;
    await handleTaskEdit({ taskId: taskA._id, text: 'No-op' });

    expect(formError.value).toBe('Task not found');
    expect(openTaskModal.value).toBe(true);
  });

  it('keeps formError unchanged when editing fails with a non-Convex error', async () => {
    mockEdit.mockRejectedValueOnce(new Error('timeout'));

    const { handleTaskEdit, formError } = useTasks();

    formError.value = 'Existing error';
    await handleTaskEdit({ taskId: taskA._id, text: 'No-op' });

    expect(formError.value).toBe('Existing error');
  });

  it('accepts getter args for handleTaskEdit', async () => {
    const { handleTaskEdit } = useTasks();

    await handleTaskEdit(() => ({ taskId: taskA._id, text: 'From getter' }));

    expect(mockEdit).toHaveBeenCalledWith({ taskId: taskA._id, text: 'From getter' });
  });

  it('exposes passthrough mutation handlers for toggle and dismiss', async () => {
    const { handleTaskToggle, handleTaskDismiss } = useTasks();

    await handleTaskToggle({ taskId: taskA._id, isCompleted: true });
    await handleTaskDismiss({ taskId: taskA._id });

    expect(mockToggle).toHaveBeenCalledWith({ taskId: taskA._id, isCompleted: true });
    expect(mockDismiss).toHaveBeenCalledWith({ taskId: taskA._id });
  });

  it('resets form state via $resetForm', () => {
    const { $resetForm, taskName, openTaskModal, currentTask, formError } = useTasks();

    taskName.value = 'Temporary text';
    openTaskModal.value = true;
    currentTask.value = taskB as Task;
    formError.value = 'Error';

    $resetForm();

    expect(taskName.value).toBe('');
    expect(openTaskModal.value).toBe(false);
    expect(currentTask.value).toBeNull();
    expect(formError.value).toBeNull();
  });
});
