<template>
  <ion-accordion-group
    multiple
  >
    <template
      v-for="accordion in accordionsGroups"
      :key="accordion.value"
    >
      <ion-accordion :value="accordion.value">
        <ion-item slot="header">
          <ion-badge slot="end">
            {{ accordion.tasks.value.length }}
          </ion-badge>
          <ion-label>{{ accordion.header }}</ion-label>
        </ion-item>
        <task-list
          slot="content"
          :tasks="accordion.tasks.value"
          :handle-task-toggle
          :handle-task-dismiss
        />
      </ion-accordion>
    </template>
  </ion-accordion-group>
</template>

<script setup lang="ts">
const accordionsGroups = [
  {
    value: 'first',
    header: 'Todo',
    tasks: computed(() => props.tasks?.filter(task => !task.isCompleted) ?? []),
  },
  {
    value: 'second',
    header: 'Completed',
    tasks: computed(() => props.tasks?.filter(task => task.isCompleted) ?? []),
  },
];

const props = defineProps<{
  tasks: Task[];
  handleTaskToggle: TaskToggleHandler;
  handleTaskDismiss: TaskDismissHandler;
}>();
</script>
