<script setup>
import { useToast } from 'primevue/usetoast';
import {useAuthStore} from "@/stores/authorization.js";
import UserImage from "@/components/auth/UserImage.vue";
import {computed, reactive} from "vue";

const authStore = useAuthStore()
const userDetails = authStore.userDetails
const unchangedUserDetails = {...authStore.userDetails}
const toast = useToast();
const {newPassword, newPasswordConfirm} = reactive({
    newPassword: '',
    newPasswordConfirm: ''
})

const saveChangedUSerDetails = () =>  {
    toast.add({ severity: 'success',group: 'bl', summary: 'Success', detail: 'User details saved!' , life: 3000 });
}
const newImageEmitHandler = (newImage) => {
    userDetails.imageUrl = newImage
}

const userChanged = computed(() => {
    return userDetails.imageUrl !== unchangedUserDetails.imageUrl
})

// todo: add password change functionality, username, email, img
// check if username/email is unique and not empty



</script>
<template>
    <div class="p-fluid m-2">
        <form @submit.prevent>
            <div class="flex justify-content-center align-items-center">
                <UserImage :img-src="userDetails.imageUrl" @new-image="newImageEmitHandler"/>
            </div>
            <FloatLabel class="mt-3">
                <label for="userName">Username</label>
                <InputText id="userName" v-model="userDetails.userName"/>
            </FloatLabel>
            <FloatLabel class="mt-3">
                <label for="email">Email</label>
                <InputText id="email" v-model="userDetails.email"/>
            </FloatLabel>
            <FloatLabel class="mt-3">
                <label for="password">New Password</label>
                <InputText id="password" v-model="newPassword"/>
            </FloatLabel>
            <FloatLabel class="mt-3">
                <label for="passwordConfirm">Confirm New Password</label>
                <InputText id="passwordConfirm" v-model="newPasswordConfirm"/>
            </FloatLabel>
            <Button class="mt-2" label="save" @click.prevent="saveChangedUSerDetails" :disabled="!userChanged"></Button>
        </form>
    </div>
</template>

<style>
</style>
