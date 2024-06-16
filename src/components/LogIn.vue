<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Auth } from '@/auth'
  import { validateInputs } from '@/helpers/loginFormValidationErrors.ts';
  import BaseTextInput from '@/components/BaseTextInput.vue'
  import BaseCheckboxInput from '@/components/BaseCheckboxInput.vue'
  import UserNavigation from '@/components/UserNavigation.vue';

  const router = useRouter()
  const email = defineModel<string>('email')
  const password = defineModel<string>('password')
  const remember = defineModel<boolean>('remember', {default: false})

  const displayError = defineModel<boolean>('errors', {default: false})
  const errorMessage = ref('')

  function onSubmit() {
    displayError.value = false
    errorMessage.value = validateInputs(email.value, password.value)

    if (errorMessage.value !== '') {
      displayError.value = true
      return
    }

    let auth = new Auth(remember)
    auth.Login(
      email.value, 
      password.value,
      ()=>{
        router.push('/')
      }, 
      ()=>{
        displayError.value = true
        errorMessage.value = "Failed to log in. Try again."
      }
    )
  }
</script>

<template>
  <v-app>
    <v-main>
      <UserNavigation />
      <div>
        <form  novalidate @submit.prevent = "onSubmit()">
          <BaseTextInput type="email" required v-model="email" label="Email" />
          <BaseTextInput type="password" required v-model="password" label="Password" />
          <BaseCheckboxInput type="checkbox" v-model="remember" label="Remember-me" />
          <p v-if="displayError">{{ errorMessage }}</p>
          <button type="submit">Log In</button>
        </form>
          <RouterLink :to="{name: 'signup'}">Sign Up</RouterLink>
      </div>
    </v-main>
  </v-app>
</template>