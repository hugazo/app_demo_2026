<template>
  <ion-page>
    <task-header />
    <task-content />
    <task-modal />
  </ion-page>
</template>

<script setup lang="ts">
const { handleLogout } = useAuth();

provide(LogoutHandlerKey, handleLogout);

const {
  taskCount,
  isPending,
  handleOpenTaskModal,
  completedTasks,
  pendingTasks,
  handleTaskToggle,
  handleTaskDismiss,
  openTaskModal,
  taskName,
  formError,
  handleNewTask,
  currentTask,
  handleTaskEdit,
  $resetForm,
} = useTasks();

provide(TaskCountKey, taskCount);
provide(TasksPendingKey, isPending);
provide(CompletedTasksKey, completedTasks);
provide(PendingTasksKey, pendingTasks);
provide(TaskToggleHandlerKey, handleTaskToggle);
provide(TaskDismissHandlerKey, handleTaskDismiss);
provide(OpenTaskModalKey, openTaskModal);
provide(TaskNameKey, taskName);
provide(FormErrorKey, formError);
provide(NewTaskHandlerKey, handleNewTask);
provide(CurrentTaskKey, currentTask);
provide(OpenTaskModalHandlerKey, handleOpenTaskModal);
provide(TaskEditHandlerKey, handleTaskEdit);
provide(ResetTaskFormKey, $resetForm);

definePageMeta({
  priority: 2,
});
</script>
