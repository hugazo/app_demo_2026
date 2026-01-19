<template>
  <ion-app>
    <template v-if="loading">
      <ion-spinner />
    </template>
    <template v-else>
      <ion-router-outlet />
    </template>
  </ion-app>
</template>

<script setup lang="ts">
const { client } = useAuth();

const loading = ref(true);

const session = await client.getSession();

loading.value = false;

console.log('App loaded, session:', session.data);
</script>
