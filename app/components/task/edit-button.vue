<template>
  <ion-item-option
    color="primary"
    @click="handleTaskEditStart({ taskId })"
  >
    <ion-icon :icon="ioniconsPencil" />
  </ion-item-option>
</template>

<script setup lang="ts">
const handleTaskEditStart = inject(TaskEditStartHandlerKey) as TaskEditStartHandler;

defineProps<{
  taskId: TaskId;
}>();
</script>
