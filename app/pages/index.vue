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
        :handle-task-toggle="mutateCompletionStatus"
        :handle-task-delete="mutateDeleteTask"
      />
      <ion-button @click="handleLogout">
        Logout
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { api } from '@convex/_generated/api';

const { handleLogout } = useAuth();

const {
  data: tasks,
  isPending,
} = useConvexQuery(api.tasks.getPending, {});

const { mutate: mutateCompletionStatus } = useConvexMutation(
  api.tasks.updateCompletionStatus,
);

const { mutate: mutateDeleteTask } = useConvexMutation(
  api.tasks.dismiss,
);
</script>
