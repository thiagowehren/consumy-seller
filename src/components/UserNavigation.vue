<template>
  <v-app-bar flat color="#fff">
    <div class="flex items-center justify-between font-sans w-full">
      <div class="flex items-center space-x-2 ml-4">
        <h1 class="text-3xl font-bold text-red-accent-4 ml-4">Delivery</h1>
      </div>
      <div class="flex items-center space-x-4">
        <template v-if="isLoggedIn">
          <div class="flex items-center space-x-4">
            <span v-if="currentUser.email" class="text-red-accent-4 underline">{{ currentUser.email }}</span>
            <v-btn @click="logout" class="text-red-accent-4" append-icon="mdi-logout" text>
              Sair
            </v-btn>
          </div>
        </template>
        <template v-else>
          <div class="mr-2">
            <RouterLink :to="{ name: 'login' }">
              <v-btn class="text-red-accent-4" text prepend-icon="mdi-login">
                Entrar
              </v-btn>
            </RouterLink>
            <RouterLink :to="{ name: 'signup' }">
              <v-btn class="bg-red-accent-4" prepend-icon="mdi-account-plus" variant="tonal">
                Criar Conta
              </v-btn>
            </RouterLink>
          </div>
        </template>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { Auth } from '@/auth';

const auth = new Auth();
const isLoggedIn = ref(auth.isLoggedIn());
const currentUser = ref(auth.currentUser());
const router = useRouter();

const logout = () => {
  auth.SignOut(() => {
    isLoggedIn.value = auth.isLoggedIn();
    currentUser.value = auth.currentUser();
    if (router.currentRoute.value.name === 'home') {
      router.go(0);
    } else {
      router.push({ name: 'home' })
    }
  });
};

watchEffect(() => {
  isLoggedIn.value = auth.isLoggedIn();
  currentUser.value = auth.currentUser();
});
</script>
