<script setup lang="ts">
  import { ref } from 'vue'
  import { RouterLink } from 'vue-router'
  import { Auth } from '@/auth'

  const auth = new Auth()
  const isLoggedIn = ref(auth.isLoggedIn())
  const currentUser = ref(auth.currentUser())

  function Logout(){
    auth.SignOut(() => {
      isLoggedIn.value = auth.isLoggedIn()
    })
  }
</script>

<template>
  <main>
    <h1>Welcome to Seller Central Page</h1>

    <template v-if="isLoggedIn">
      <h3>Hello, {{currentUser && currentUser.email}}</h3>
      <br/>
      <nav>
        <a @click="Logout">Log Out</a>
      </nav>
    </template>

    <template v-else>
      <h3>Log in or Sign in</h3>
      <nav>
        <RouterLink :to="{name: 'login'}">Login</RouterLink>
        <RouterLink :to="{name: 'signup'}">Sign Up</RouterLink>
      </nav>
    </template>
  </main>
</template>