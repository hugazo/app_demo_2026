import type { Doc, Id } from '@convex/_generated/dataModel';
import { api } from '@convex/_generated/api';

export type Task = Doc<'tasks'>;
export type TaskId = Id<'tasks'>;
export type TaskDismissHandler = (args: MaybeRefOrGetter<{ id: TaskId }>) => Promise<null>;
export type TaskToggleHandler = (args: MaybeRefOrGetter<{ id: TaskId; isCompleted: boolean }>) => Promise<null>;
export type TaskEditStartHandler = (args: MaybeRefOrGetter<{ task: Task }>) => void;
export type NewTaskHandler = () => Promise<void>;

export const useTasks = () => {
  const {
    data: tasks,
    isPending,
  } = useConvexQuery(api.tasks.getAll);

  const { mutate: handleTaskToggle } = useConvexMutation(
    api.tasks.updateCompletionStatus,
  );

  const { mutate: handleTaskDismiss } = useConvexMutation(
    api.tasks.dismiss,
  );

  const openAddTaskModal = useState<boolean>('tasks:openAddTaskModal', () => false);
  const taskName = useState<string>('tasks:taskName', () => '');

  const { mutate: addTask } = useConvexMutation(api.tasks.add);

  const handleNewTask = async () => {
    await addTask({ text: taskName.value });
    taskName.value = '';
    openAddTaskModal.value = false;
  };

  const handleTaskEditStart = (args: { task: Task }) => {
    const { task } = unref(args);
    // Todo: Implement and show the edit task modal
    console.log('Edit task', task);
  };

  return {
    tasks,
    isPending,
    openAddTaskModal,
    taskName,
    handleTaskToggle,
    handleTaskDismiss,
    handleNewTask,
    handleTaskEditStart,
  };
};
