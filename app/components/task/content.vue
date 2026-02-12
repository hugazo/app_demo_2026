<template>
  <ion-content class="ion-padding">
    <p v-if="isPending">
      Loading...
    </p>
    <p v-else-if="taskCount === 0">
      No tasks!
    </p>
    <task-accordion v-else />
  </ion-content>
</template>

<script setup lang="ts">
const isPending = inject(TasksPendingKey) as ComputedRef<boolean>;
const taskCount = inject(TaskCountKey) as ComputedRef<number>;
</script>
