<template>
  <ion-page>
    <ion-content>
      <ion-header>
        <ion-toolbar>
          <ion-title>Register Page</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <ion-item>
          <ion-input
            v-model="name"
            label="Name"
            type="text"
          />
        </ion-item>
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
          />
        </ion-item>
        <ion-item>
          <ion-button @click="handleRegister">
            Register
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
const authClient = useAuthClient();

const name = ref('');
const email = ref('');
const password = ref('');

const handleRegister = async () => {
  const _user = await authClient.signUp.email({
    name: name.value,
    email: email.value,
    password: password.value,
  });
  // Registration works, need to handle post-registration logic
};
</script>
