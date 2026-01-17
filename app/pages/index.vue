<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <pre>{{ tasks }}</pre>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { api } from '../../convex/_generated/api';

const { data: tasks } = useConvexQuery(api.tasks.getPending);
</script>
