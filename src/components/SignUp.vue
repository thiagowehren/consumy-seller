<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Auth } from '@/auth'
  import { validateInputs } from '@/helpers/signupFormValidationErrors.ts';
  import BaseTextInput from '@/components/BaseTextInput.vue'

  const router = useRouter()
  const email = defineModel<string>('email')
  const password = defineModel<string>('password')
  const passwordConfirm = defineModel<string>('passwordConfirm')

  const displayError = defineModel<boolean>('errors', {default: false})
  const errorMessage = ref('')

  function onSubmit() {
    displayError.value = false
    errorMessage.value = validateInputs(email.value, password.value, passwordConfirm.value)

    if (errorMessage.value !== '') {
      displayError.value = true
      return
    }

    let auth = new Auth()
    auth.SignUp(
      email.value, 
      password.value, 
      passwordConfirm.value,
      ()=>{
        router.push('/')
      }, 
      ()=>{
        displayError.value = true
        errorMessage.value = "Failed to sign up."
      }
    )
  }
</script>

<template>
  <main>
    <div>
      {{email}}
      {{password}}
      {{passwordConfirm}}
      <form novalidate @submit.prevent = "onSubmit()">
        {{handleInputValidation}}
        <BaseTextInput type="email" required v-model="email" label="Email" />
        <BaseTextInput type="password" required v-model="password" label="Password" />
        <BaseTextInput type="password" required v-model="passwordConfirm" label="Confirm Password" />
        <p v-if="displayError"> {{errorMessage}} </p>
        <button type="submit">Sign In</button>
      </form>
    </div>
  </main>
</template>