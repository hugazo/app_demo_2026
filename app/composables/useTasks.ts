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

  return {
    tasks,
    isPending,
    handleTaskToggle,
    handleTaskDismiss,
  };
};
