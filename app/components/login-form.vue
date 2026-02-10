<template>
  <ion-list>
    <ion-item>
      <ion-input
        v-model="email"
        label="Email"
        type="email"
      />
    </ion-item>
    <ion-item>
      <ion-input
        v-model="password"
        label="Password"
        type="password"
        @keyup.enter="handleEmailSignIn({ email, password, callbackURL, rememberMe })"
      />
    </ion-item>
    <ion-item>
      <ion-button @click="handleEmailSignIn({ email, password, callbackURL, rememberMe })">
        Login
      </ion-button>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
const email = ref('');
const password = ref('');

const rememberMe = ref(false);
const callbackURL = ref<string | undefined>(undefined);

const handleEmailSignIn = inject(EmailSignInHandlerKey) as EmailSignInHandler;
</script>
