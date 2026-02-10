<template>
  <ion-item-option
    color="danger"
    @click="handleTaskDismiss({ id: taskId })"
  >
    <ion-icon :icon="ioniconsTrashBin" />
  </ion-item-option>
</template>

<script setup lang="ts">
const handleTaskDismiss = inject(TaskDismissHandlerKey) as TaskDismissHandler;

defineProps<{
  taskId: TaskId;
}>();
</script>
