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
        />
      </ion-accordion>
    </template>
  </ion-accordion-group>
</template>

<script setup lang="ts">
const tasks = inject(TasksCollectionKey) as TasksCollection;

const filterTasks = (completed: boolean) => {
  return tasks.value?.filter(task => task.isCompleted === completed) ?? [];
};

const accordionsGroups = [
  {
    value: 'first',
    header: 'Todo',
    tasks: computed(() => filterTasks(false)),
  },
  {
    value: 'second',
    header: 'Completed',
    tasks: computed(() => filterTasks(true)),
  },
];
</script>
