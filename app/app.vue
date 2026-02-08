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
const router = useIonRouter();
const { authInitialized, loggedIn } = useAuth();

watchEffect(() => {
  if (authInitialized.value && !loggedIn.value) {
    router.push('/login');
  }
});
</script>
