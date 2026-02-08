<template>
  <ion-page>
    <ion-content>
      <ion-header>
        <ion-toolbar>
          <ion-title>Login Page</ion-title>
        </ion-toolbar>
      </ion-header>
      <login-form
        :handle-login="handleEmailSignIn"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
const { handleEmailSignIn } = useAuth();

definePageMeta({
  allowUnauthenticated: true,
});
</script>
