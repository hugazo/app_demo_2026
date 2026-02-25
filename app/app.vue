<template>
  <ion-app>
    <template v-if="!initialized">
      <loader-loading-page />
    </template>
    <template v-else>
      <ion-router-outlet />
    </template>
  </ion-app>
</template>

<script setup lang="ts">
const { initialized } = useAppStatus();
</script>
