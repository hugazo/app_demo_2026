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
        @keyup.enter="handleLogin({ email, password, callbackURL, rememberMe })"
      />
    </ion-item>
    <ion-item>
      <ion-button @click="handleLogin({ email, password, callbackURL, rememberMe })">
        Login
      </ion-button>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import type { LoginHandler } from '@/composables/useAuth';

const email = ref('');
const password = ref('');

const rememberMe = ref(false);
const callbackURL = ref<string | undefined>(undefined);

defineProps<{
  handleLogin: LoginHandler;
}>();
</script>
