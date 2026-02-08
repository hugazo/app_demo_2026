<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p v-if="isPending">
        Loading
      </p>
      <p v-else-if="tasks?.length === 0">
        No pending tasks!
      </p>
      <task-list
        v-else
        :tasks="tasks!!"
        :handle-task-toggle
        :handle-task-dismiss
      />
      <ion-button @click="handleLogout">
        Logout
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
const { handleLogout } = useAuth();

const {
  tasks,
  isPending,
  handleTaskToggle,
  handleTaskDismiss,
} = useTasks();
</script>
