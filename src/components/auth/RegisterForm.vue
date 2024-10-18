<script setup>

import {computed, reactive} from "vue";
import {useAuthStore} from "@/stores/authorization.js";
import {usePublicUserStore} from "@/stores/publicUserStore.js";
import { useToast } from 'primevue/usetoast';
import UserImage from "@/components/auth/UserImage.vue";
import CountrySelect from "@/components/auth/CountrySelect.vue";
console.log('RegisterForm.vue')
const toast = useToast();
const publicUserStore = usePublicUserStore()
const authStore = useAuthStore()

const state = reactive({
    userName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    cca3:'',
    loading: false,
    errorMessage: '',
    userNameError: '',
    emailError: '',
    newImageUrl: '',
    newImageFile:null
})


const registerClickHandler = async () => {
    state.loading = true
    const res = await authStore.register(state.userName, state.email, state.password, state.passwordConfirm, state.newImageFile, state.cca3)
    if (!res.success) {
        state.errorMessage = res.error
        toast.add({ severity: 'error',group: 'bl', summary: 'Error', detail: state.errorMessage , life: 3000 });
    } else {

        toast.add({ severity: 'success',group: 'bl', summary: 'Success', detail: 'You have successfully registered!' , life: 3000 });
        state.userName = ''
        state.email = ''
        state.password = ''
        state.passwordConfirm = ''
    }
    state.loading = false
}

const userNameNotUnique = computed(() => {
    const isNotUnique = publicUserStore.publicUsers.some(user => user.userName === state.userName)
    if(isNotUnique){
        state.userNameError = 'Username is already taken'
    } else {
        state.userNameError = ''
    }
    return isNotUnique
})

const registerBtnDisabled = computed(() => {
    return state.userName.length < 1
        || state.email.length < 1
        || state.password.length < 1
        || state.passwordConfirm.length < 1
        || state.password !== state.passwordConfirm
        || !state.email.includes('@') || state.email.length < 3
        || userNameNotUnique.value
})

const validateEmail = () => {
    console.log('validate email')
    if (!state.email.includes('@') || state.email.length < 3) {
        state.emailError = 'Invalid email'
    } else {
        state.emailError = ''
    }
}

const newUserImageSelected = (e) => {
    const image = e.target.files[0]
    const imageName = image.name.replaceAll(' ', '_')
    const file = new File([image], imageName, { type: image.type });
    state.newImageFile = file
    state.newImageUrl = URL.createObjectURL(file)
}

const countryChangedEmitHandler = (e) => {
    console.log('country changed', e)
    state.cca3 = e.cca3
}


</script>

<template>
    <div class="p-fluid">
        <div class="flex justify-content-center">
            <img v-if="state.newImageUrl" :src="state.newImageUrl" alt="user image" class="user-image-container" @click="$refs.registerNewUserImage.click()">
            <div v-else class="user-image-container">
                <i class="pi pi-user no-user-image" @click="$refs.registerNewUserImage.click()"></i>
            </div>
            <input type="file" ref="registerNewUserImage" class="hidden" @change="newUserImageSelected">
        </div>
        <CountrySelect @change="countryChangedEmitHandler"  />
        <FloatLabel class="mt-3">
            <InputText v-model="state.userName" id="registerUserName" minlength="1" maxlength="80"/>
            <label for="registerUserName" style="background-color: #262626; color: white">User Name</label>
            <p v-if="state.userNameError" class="text-red-600">{{ state.userNameError }}</p>

        </FloatLabel>

        <FloatLabel class="mt-3">
            <InputText type="email" v-model="state.email" id="registerEmail" minlength="1" maxlength="80" @blur="validateEmail"/>
            <label for="registerEmail" style="background-color: #262626; color: white">Email</label>
            <p v-if="state.emailError" class="text-red-600">{{ state.emailError }}</p>

        </FloatLabel>

        <FloatLabel class="mt-3">
            <InputText type="password" v-model="state.password" id="registerPassword" minlength="1" maxlength="80"/>
            <label for="registerPassword" style="background-color: #262626; color: white">Password</label>
        </FloatLabel>

        <FloatLabel class="mt-3">
            <InputText type="password" v-model="state.passwordConfirm" id="registerPasswordConfirm" minlength="1"
                       maxlength="80"/>
            <label for="registerPasswordConfirm" style="background-color: #262626; color: white">Confirm Password</label>
        </FloatLabel>

        <div class="flex flex-wrap align-items-center justify-content-end">
            <Button @click="registerClickHandler"
                    :disabled="registerBtnDisabled"
                    class="mt-4 ml-auto px-3 text-center"
                    icon="pi pi-check"
                    :loading="state.loading" label="register"/>
            <p v-if="state.errorMessage" class="text-red-600">{{ state.errorMessage }}</p>
        </div>

    </div>
</template>

<style scoped>
.no-user-image {
    font-size: 8rem;
    color: #ccc;
}

.user-image-container {
    width: 12rem;
    height: 12rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 50%;
    margin: 0.5rem;
    cursor:pointer;
}

</style>