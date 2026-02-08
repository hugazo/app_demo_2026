<template>
  <ion-app>
    <template v-if="!authInitialized">
      <ion-spinner />
    </template>
    <template v-else>
      <ion-router-outlet />
    </template>
  </ion-app>
</template>

<script setup lang="ts">
const { authInitialized } = useAuth();
</script>
