<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      Settings content
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
definePageMeta({
  priority: 3,
});
</script>
