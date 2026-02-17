<template>
  <ion-page>
    <ion-content>
      <h1>Developer Tab</h1>
      <p>This is the Developer tab content.</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
if (process.env.NODE_ENV !== 'development') {
  throw new Error('Developer tab should only be accessible in development environment');
}

definePageMeta({
  onlyDev: true,
  priority: 10,
});
</script>
