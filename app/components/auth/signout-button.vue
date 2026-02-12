<template>
  <ion-buttons>
    <ion-button @click="handleLogout">
      Logout
    </ion-button>
  </ion-buttons>
</template>

<script setup lang="ts">
const handleLogout = inject(LogoutHandlerKey) as LogoutHandler;
</script>
