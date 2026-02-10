<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="handleLogout">
            Logout
          </ion-button>
        </ion-buttons>
        <ion-title>Tasks {{ isPending ? 'Loading...' : tasks?.length || 0 }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            :strong="true"
            @click="openAddTaskModal = !openAddTaskModal"
          >
            Add Task
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p v-if="isPending">
        Loading...
      </p>
      <p v-else-if="tasks?.length === 0">
        No tasks!
      </p>
      <tasks-accordion
        v-else
        :tasks="tasks!"
      />
    </ion-content>
    <add-task-modal
      v-model:task-name="taskName"
      v-model:open="openAddTaskModal"
    />
  </ion-page>
</template>

<script setup lang="ts">
const { handleLogout } = useAuth();
const {
  tasks,
  isPending,
  taskName,
  openAddTaskModal,
} = useTasks();
</script>
