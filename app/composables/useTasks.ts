import type { Doc, Id } from '@convex/_generated/dataModel';
import { ConvexError } from 'convex/values';
import { api } from '@convex/_generated/api';
import type { InjectionKey } from 'vue';

// Data
export type TaskId = Id<'tasks'>;
export type Task = Doc<'tasks'>;

export type TasksPendingRef = Ref<boolean>;
export const TasksPendingKey = Symbol() as InjectionKey<TasksPendingRef>;

export const CompletedTasksKey = Symbol() as InjectionKey<ComputedRef<Task[]>>;
export const PendingTasksKey = Symbol() as InjectionKey<ComputedRef<Task[]>>;
export const TaskCountKey = Symbol() as InjectionKey<ComputedRef<number>>;

// Task Handlers

export type TaskDismissHandler = (args: MaybeRefOrGetter<{ id: TaskId }>) => Promise<null>;
export const TaskDismissHandlerKey = Symbol() as InjectionKey<TaskDismissHandler>;

export type TaskToggleHandler = (args: MaybeRefOrGetter<{ id: TaskId; isCompleted: boolean }>) => Promise<null>;
export const TaskToggleHandlerKey = Symbol() as InjectionKey<TaskToggleHandler>;

export type TaskEditStartHandler = (args: MaybeRef<{ taskId: TaskId }>) => void;
export const TaskEditStartHandlerKey = Symbol() as InjectionKey<TaskEditStartHandler>;

export type NewTaskHandler = () => Promise<void>;
export const NewTaskHandlerKey = Symbol() as InjectionKey<NewTaskHandler>;

export type TaskEditHandler = (args: MaybeRefOrGetter<{ id: TaskId; text: string }>) => Promise<void>;
export const TaskEditHandlerKey = Symbol() as InjectionKey<TaskEditHandler>;

// Modal handlers
export type OpenTaskModalHandler = (taskId: TaskId | undefined) => void;
export const OpenTaskModalHandlerKey = Symbol() as InjectionKey<OpenTaskModalHandler>;
export const ResetTaskFormKey = Symbol() as InjectionKey<() => void>;

// Modal form
export const CurrentTaskKey = Symbol() as InjectionKey<Ref<Task | null>>;
export const OpenTaskModalKey = Symbol() as InjectionKey<Ref<boolean>>;
export const TaskNameKey = Symbol() as InjectionKey<Ref<string>>;
export const FormErrorKey = Symbol() as InjectionKey<Ref<string | null>>;

export const useTasks = () => {
  const {
    data: tasks,
    isPending,
  } = useConvexQuery(api.tasks.getAll);

  const completedTasks = computed(() => tasks.value?.filter(task => task.isCompleted) ?? []);
  const pendingTasks = computed(() => tasks.value?.filter(task => !task.isCompleted) ?? []);
  const taskCount = computed(() => tasks.value?.length ?? 0);

  const { mutate: handleTaskToggle } = useConvexMutation(
    api.tasks.updateCompletionStatus,
  );

  const { mutate: handleTaskDismiss } = useConvexMutation(
    api.tasks.dismiss,
  );

  const openTaskModal = ref<boolean>(false);

  const taskName = ref<string>('');
  const formError = ref<string | null>(null);

  const addTask = useConvexMutation(api.tasks.add);
  const handleNewTask = async () => {
    try {
      await addTask.mutate({ text: taskName.value });
      $resetForm();
    }
    catch (error) {
      $handleError(error);
    }
  };

  const currentTask = ref<Task | null>(null);

  const handleOpenTaskModal = (taskId?: TaskId) => {
    if (taskId) {
      const task = tasks.value?.find(task => task._id === taskId) ?? null;
      currentTask.value = task;
      taskName.value = task?.text ?? '';
    }
    else {
      currentTask.value = null;
      taskName.value = '';
    }
    openTaskModal.value = true;
  };

  const { mutate: _handleTaskEdit } = useConvexMutation(api.tasks.editText);

  const handleTaskEdit = async (args: MaybeRefOrGetter<{ id: TaskId; text: string }>) => {
    try {
      const { id, text } = toValue(args);
      await _handleTaskEdit({ id, text });
      $resetForm();
    }
    catch (error) {
      $handleError(error);
    }
  };

  const $handleError = (error: unknown) => {
    if (error instanceof ConvexError) {
      formError.value = error.data.message;
    }
  };

  const $resetForm = () => {
    currentTask.value = null;
    taskName.value = '';
    openTaskModal.value = false;
    formError.value = null;
  };

  return {
    taskCount,
    isPending,
    handleOpenTaskModal,
    taskName,
    completedTasks,
    pendingTasks,
    handleTaskToggle,
    handleTaskDismiss,
    openTaskModal,
    formError,
    handleNewTask,
    currentTask,
    handleTaskEdit,
    $resetForm,
  };
};
