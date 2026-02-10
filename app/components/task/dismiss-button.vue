<template>
  <ion-item-option
    color="danger"
    @click="handleTaskDismiss({ id: taskId })"
  >
    <ion-icon :icon="ioniconsTrashBin" />
  </ion-item-option>
</template>

<script setup lang="ts">
defineProps<{
  taskId: TaskId;
  handleTaskDismiss: TaskDismissHandler;
}>();
</script>
