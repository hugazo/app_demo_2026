<template>
  <ion-list>
    <ion-item-sliding
      v-for="task in tasks"
      :key="task._id"
    >
      <ion-item :color="task.isCompleted ? 'success' : 'medium'">
        <ion-toggle
          :checked="task.isCompleted"
          @ion-change="handleTaskToggle({ id: task._id, isCompleted: $event.detail.checked })"
        >
          {{ task.text }}
        </ion-toggle>
      </ion-item>

      <ion-item-options>
        <task-dismiss-button
          :task-id="task._id"
          :handle-task-dismiss="handleTaskDismiss"
        />
        <task-edit-button
          :task-id="task._id"
        />
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
</template>

<script setup lang="ts">
defineProps<{
  tasks: Task[];
  handleTaskToggle: TaskToggleHandler;
  handleTaskDismiss: TaskDismissHandler;
}>();
</script>
