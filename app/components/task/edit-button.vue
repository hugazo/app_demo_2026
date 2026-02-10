<template>
  <ion-item-option
    color="primary"
    @click="handleTaskEditStart({ task })"
  >
    <ion-icon :icon="ioniconsPencil" />
  </ion-item-option>
</template>

<script setup lang="ts">
import type { Task, TaskEditStartHandler } from '@/composables/useTasks';

defineProps<{
  task: Task;
  handleTaskEditStart: TaskEditStartHandler;
}>();
</script>
