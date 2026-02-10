<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="handleLogout">
            Logout
          </ion-button>
        </ion-buttons>
        <ion-title>Tasks ({{ tasks?.length ?? 0 }})</ion-title>
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
        :tasks="tasks!!"
        :handle-task-toggle
        :handle-task-dismiss
        :handle-task-edit-start
      />
    </ion-content>
    <add-task-modal
      v-model:task-name="taskName"
      v-model:open="openAddTaskModal"
      :new-task-handler="handleNewTask"
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
  handleTaskToggle,
  handleTaskDismiss,
  handleNewTask,
  handleTaskEditStart,
} = useTasks();
</script>
