<template>
  <ion-page>
    <ion-content>
      <ion-header>
        <ion-toolbar>
          <ion-title>Login Page</ion-title>
        </ion-toolbar>
      </ion-header>
      <login-form />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
const { handleEmailSignIn } = useAuth();

provide(EmailSignInHandlerKey, handleEmailSignIn);

definePageMeta({
  allowUnauthenticated: true,
});
</script>
