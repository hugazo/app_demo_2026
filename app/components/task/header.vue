<template>
  <ion-header>
    <ion-toolbar>
      <auth-signout-button slot="start" />
      <ion-title>
        Tasks {{ isPending ? 'Loading...' : `(${taskCount})` }}
      </ion-title>
      <ion-buttons slot="end">
        <ion-button
          strong
          @click="handleOpenTaskModal(undefined)"
        >
          Add Task
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
const taskCount = inject(TaskCountKey) as ComputedRef<number>;
const isPending = inject(TasksPendingKey) as ComputedRef<boolean>;
const handleOpenTaskModal = inject(OpenTaskModalHandlerKey) as OpenTaskModalHandler;
</script>
