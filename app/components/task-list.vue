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
        <ion-item-option
          color="danger"
          @click="handleTaskDelete({ id: task._id })"
        >
          Delete
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
</template>

<script setup lang="ts">
import type { Doc, Id } from '@convex/_generated/dataModel';

type Task = Doc<'tasks'>;
type TaskToggleHandler = (args: MaybeRefOrGetter<{ id: Id<'tasks'>; isCompleted: boolean }>) => Promise<null>;
type TaskDeleteHandler = (args: MaybeRefOrGetter<{ id: Id<'tasks'> }>) => Promise<null>;

defineProps<{
  tasks: Task[];
  handleTaskToggle: TaskToggleHandler;
  handleTaskDelete: TaskDeleteHandler;
}>();
</script>
