<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p v-if="!tasks.isPending">
        Loading
      </p>
      <template v-else>
        <ion-list>
          <ion-item-sliding
            v-for="task in tasks.data.value"
            :key="task._id"
          >
            <ion-item>
              <ion-toggle
                :checked="task.isCompleted"
                @ion-change="handleTaskToggle(task._id, $event.detail.checked)"
              >
                {{ task.text }}
              </ion-toggle>
            </ion-item>

            <ion-item-options>
              <ion-item-option
                color="danger"
                @click="handleTaskDelete(task._id)"
              >
                Delete
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>
      </template>
      <ion-button>Click me</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

const tasks = useConvexQuery(api.tasks.getAll);

const { mutate: mutateCompletionStatus } = useConvexMutation(
  api.tasks.updateCompletionStatus,
);

const { mutate: mutateDeleteTask } = useConvexMutation(
  api.tasks.dismiss,
);

const handleTaskToggle = (taskId: Id<'tasks'>, isCompleted: boolean) => {
  mutateCompletionStatus({ id: taskId, isCompleted });
};

const handleTaskDelete = (taskId: Id<'tasks'>) => {
  mutateDeleteTask({ id: taskId });
};
</script>
