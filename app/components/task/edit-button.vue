<template>
  <ion-item-option
    color="primary"
    @click="handleOpenTaskModal(taskId)"
  >
    <ion-icon :icon="ioniconsPencil" />
  </ion-item-option>
</template>

<script setup lang="ts">
const handleOpenTaskModal = inject(OpenTaskModalHandlerKey) as OpenTaskModalHandler;

defineProps<{
  taskId: TaskId;
}>();
</script>
