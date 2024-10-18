<script setup>
import { useToast } from 'primevue/usetoast';
import {useAuthStore} from "@/stores/authorization.js";
import UserImage from "@/components/auth/UserImage.vue";
import {computed, reactive} from "vue";
import CountrySelect from "@/components/auth/CountrySelect.vue";

const authStore = useAuthStore()
const userDetails = authStore.userDetails
const unchangedUserDetails = {...authStore.userDetails}
const toast = useToast();

const saveChangedUserDetails = async () => {
    const updateObject = {
        userName: userDetails.userName,
        email: userDetails.email,
        imageUrl: userDetails.imageUrl,
        cca3: userDetails.cca3
    }
    console.log(updateObject)
    const res = await authStore.updateUser(updateObject)
    console.log(res)
    if (res.success){
        unchangedUserDetails.userName = userDetails.userName
        unchangedUserDetails.email = userDetails.email
        unchangedUserDetails.imageUrl = userDetails.imageUrl
        unchangedUserDetails.cca3 = userDetails.cca3
        toast.add({severity: 'success', group: 'bl', summary: 'Success', detail: 'User details saved!', life: 3000});
    } else {
        toast.add({severity: 'error', group: 'bl', summary: 'Error', detail: res.message, life: 3000});
    }


}
const newImageEmitHandler = (newImage) => {
    console.log('newImageEmitHandler', newImage)
    userDetails.imageUrl = newImage
}

const userChanged = computed(() => {
    console.log('userChanged', JSON.stringify(userDetails) !== JSON.stringify(unchangedUserDetails), userDetails.cca3)
    return JSON.stringify(userDetails) !== JSON.stringify(unchangedUserDetails)
})

const userCountryChanged = (newCountry) => {
    console.log('userCountryChanged', newCountry)
    userDetails.cca3 = newCountry.cca3
}

const resetChangesClickHandler = () => {
    userDetails.imageUrl = unchangedUserDetails.imageUrl
    userDetails.cca3 = unchangedUserDetails.cca3
    userDetails.userName = unchangedUserDetails.userName
    userDetails.email = unchangedUserDetails.email
    console.log('resetChangesClickHandler', userDetails.cca3)
}

// todo: add password change functionality, username, email, img
// check if username/email is unique and not empty



</script>
<template>
    <div class="p-fluid m-2 ">
        <form @submit.prevent class="flex-column gap-5">
            <div class="flex justify-content-center align-items-center">
                <UserImage :img-src="userDetails.imageUrl" @new-image="newImageEmitHandler" :key="userDetails.imageUrl"/>
            </div>
            <CountrySelect :user-cca3="userDetails.cca3" @change="userCountryChanged" class="mt-4" />
            <FloatLabel class="mt-4">
                <label for="userName">Username</label>
                <InputText id="userName" v-model="userDetails.userName"/>
            </FloatLabel>
            <FloatLabel class="mt-4">
                <label for="email">Email</label>
                <InputText id="email" v-model="userDetails.email"/>
            </FloatLabel>
            <Button class="mt-4" label="save" @click.prevent="saveChangedUserDetails" :disabled="!userChanged"></Button>
            <Button class="mt-2" label="cancel" @click.prevent="resetChangesClickHandler" :disabled="!userChanged"></Button>
        </form>
    </div>
</template>

<style>
</style>
