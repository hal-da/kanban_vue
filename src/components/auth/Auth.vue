<script setup>

import {ref} from "vue";
import {useAuthStore} from "@/stores/authorization.js";
const authStore = useAuthStore();

const showLoginDialog = ref(false)
const showRegisterDialog = ref(false)
const password = ref('')
const email = ref('')
const loading = ref(false)

const loginClickHandler =async () => {
  loading.value = true
  const res = await authStore.login(email.value, password.value)
  console.log(res)
  if(res.success){
    showLoginDialog.value = false
  }
  loading.value = false




  //   showLoginDialog.value = false
}




</script>

<template>
  <div v-if="authStore.isLoggedIn">
    <Button text disabled class="pr-0">hello, {{authStore.user.userName}}</Button>
    <Button @click="authStore.logout()"  text>logout</Button>
  </div>
  <div v-else>
  <Button @click="showRegisterDialog = !showRegisterDialog"  text>Register</Button>
    <Button @click="showLoginDialog = !showLoginDialog"  text>Login</Button>
    <Dialog v-model:visible="showLoginDialog" modal header="Login" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <div class="p-fluid">
        <FloatLabel class="mt-3">
          <InputText id="email" v-model="email" />
          <label for="email" style="background-color: #262626; color: white">Email</label>
        </FloatLabel>
        <FloatLabel class="mt-4">
          <Password id="password" v-model="password" />
          <label for="password"  style="background-color: #262626; color: white">Password</label>
        </FloatLabel>
        <div class="flex flex-wrap align-items-center justify-content-end">
          <Button @click="loginClickHandler" class="mt-4 ml-auto px-3 text-center" icon="pi pi-check" :loading="loading" label="login" />
        </div>
      </div>
  </Dialog>
  </div>

</template>

<style scoped>

</style>