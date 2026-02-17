<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <auth-signout-button slot="start" />
        <ion-title>Home Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-text>Hello</ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
const { handleLogout } = useAuth();

provide(LogoutHandlerKey, handleLogout);

definePageMeta({
  priority: 1,
});
</script>
