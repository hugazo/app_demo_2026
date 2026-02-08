import { api } from '@convex/_generated/api';

export const useTasks = () => {
  const {
    data: tasks,
    isPending,
  } = useConvexQuery(api.tasks.getPending, {});

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

  return {
    tasks,
    isPending,
    openAddTaskModal,
    taskName,
    handleTaskToggle,
    handleTaskDismiss,
    handleNewTask,
  };
};
