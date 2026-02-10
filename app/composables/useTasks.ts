import type { Doc, Id } from '@convex/_generated/dataModel';
import { api } from '@convex/_generated/api';
import type { InjectionKey } from 'vue';

export type Task = Doc<'tasks'>;
export type TasksCollection = Ref<Task[] | undefined>;

export const TasksCollectionKey = Symbol() as InjectionKey<TasksCollection>;
export type TasksPendingRef = Ref<boolean>;
export const TasksPendingKey = Symbol() as InjectionKey<TasksPendingRef>;

export const CompletedTasksKey = Symbol() as InjectionKey<ComputedRef<Task[]>>;
export const PendingTasksKey = Symbol() as InjectionKey<ComputedRef<Task[]>>;

export type TaskId = Id<'tasks'>;

export type TaskDismissHandler = (args: MaybeRefOrGetter<{ id: TaskId }>) => Promise<null>;
export const TaskDismissHandlerKey = Symbol() as InjectionKey<TaskDismissHandler>;

export type TaskToggleHandler = (args: MaybeRefOrGetter<{ id: TaskId; isCompleted: boolean }>) => Promise<null>;
export const TaskToggleHandlerKey = Symbol() as InjectionKey<TaskToggleHandler>;

export type TaskEditStartHandler = (args: MaybeRef<{ taskId: TaskId }>) => void;
export const TaskEditStartHandlerKey = Symbol() as InjectionKey<TaskEditStartHandler>;

export type NewTaskHandler = () => Promise<void>;
export const NewTaskHandlerKey = Symbol() as InjectionKey<NewTaskHandler>;

type TaskEditHandlerArgs = MaybeRef<{
  taskId: TaskId;
  text: Pick<Task, 'text'>;
}>;
export type TaskEditHandler = (args: TaskEditHandlerArgs) => void;
export const TaskEditHandlerKey = Symbol() as InjectionKey<TaskEditHandler>;

export const useTasks = () => {
  const {
    data: tasks,
    isPending,
  } = useConvexQuery(api.tasks.getAll);
  provide(TasksCollectionKey, tasks);
  provide(TasksPendingKey, isPending);

  const completedTasks = computed(() => tasks.value?.filter(task => task.isCompleted) ?? []);
  const pendingTasks = computed(() => tasks.value?.filter(task => !task.isCompleted) ?? []);

  provide(CompletedTasksKey, completedTasks);
  provide(PendingTasksKey, pendingTasks);


  const { mutate: handleTaskToggle } = useConvexMutation(
    api.tasks.updateCompletionStatus,
  );
  provide(TaskToggleHandlerKey, handleTaskToggle);

  const { mutate: handleTaskDismiss } = useConvexMutation(
    api.tasks.dismiss,
  );
  provide(TaskDismissHandlerKey, handleTaskDismiss);

  const openAddTaskModal = useState<boolean>('tasks:openAddTaskModal', () => false);
  const taskName = useState<string>('tasks:taskName', () => '');

  const { mutate: addTask } = useConvexMutation(api.tasks.add);

  const handleNewTask = async () => {
    await addTask({ text: taskName.value });
    taskName.value = '';
    openAddTaskModal.value = false;
  };
  provide(NewTaskHandlerKey, handleNewTask);

  const handleTaskEditStart = (args: MaybeRef<{ taskId: TaskId }>) => {
    const { taskId } = unref(args);
    // Todo: Implement and show the edit task modal
    console.log('Edit task', taskId);
  };
  provide(TaskEditStartHandlerKey, handleTaskEditStart);

  const handleTaskEdit = (args: TaskEditHandlerArgs) => {
    const { taskId, text } = unref(args);
    console.log('Edit task', taskId, 'with text', text);
  };
  provide(TaskEditHandlerKey, handleTaskEdit);

  return {
    tasks,
    isPending,
    openAddTaskModal,
    taskName,
  };
};
