<script setup>
import {useAuthStore} from "@/stores/authorization.js";
import UserImage from "@/components/auth/UserImage.vue";
import {computed, reactive, watch} from "vue";
import CountrySelect from "@/components/auth/CountrySelect.vue";
import {usePublicUserStore} from "@/stores/publicUserStore.js";
import {useToast} from "primevue/usetoast";

const toast = useToast();
const publicUserStore = usePublicUserStore()
const authStore = useAuthStore()
const userDetails = reactive({...authStore.userDetails})
const state = reactive({
    userNameError: '',
    emailError: ''
})

const newImageEmitHandler = (newImage) => {
    userDetails.imageUrl = newImage
}

const saveChangedUserDetails = async () => {
    const updateObject = {
        userName: userDetails.userName,
        email: userDetails.email,
        imageUrl: userDetails.imageUrl,
        cca3: userDetails.cca3
    }
    const res = await authStore.updateUser(updateObject)
    if (res.success){
        userDetails.imageUrl = authStore.userDetails.imageUrl
        userDetails.cca3 = authStore.userDetails.cca3
        userDetails.userName = authStore.userDetails.userName
        userDetails.email = authStore.userDetails.email
        toast.add({severity: 'success', group: 'bl', summary: 'Success', detail: 'User details saved!', life: 3000});
    } else {
        toast.add({severity: 'error', group: 'bl', summary: 'Error', detail: res.message, life: 3000});
    }
}

const resetChangesClickHandler = () => {
    userDetails.imageUrl = authStore.userDetails.imageUrl
    userDetails.cca3 = authStore.userDetails.cca3
    userDetails.userName = authStore.userDetails.userName
    userDetails.email = authStore.userDetails.email
}

const userChanged = computed(() => {
    if(userDetails.userName.length < 1 || userDetails.email.length < 1){
        return true
    }

    const emailMatcher = /[^@]+@+./

    if(!emailMatcher.test(userDetails.email) || userDetails.email.includes(' ')){
        return true
    }

    return userDetails.imageUrl == authStore.userDetails.imageUrl
        && userDetails.cca3 === authStore.userDetails.cca3
        && userDetails.userName === authStore.userDetails.userName
        && userDetails.email === authStore.userDetails.email

})

const userCountryChanged = (newCountry) => {
    userDetails.cca3 = newCountry.cca3
}

watch(
    () => userDetails.userName,
    (newVal) => {
        if(newVal.length < 1){
            state.userNameError = 'Username is required'
            return
        }
        const isNotUnique = publicUserStore.publicUsers.some(user => user.userName === newVal)
        if(isNotUnique && newVal !== authStore.userDetails.userName){
            state.userNameError = 'Username is already taken'
        } else {
            state.userNameError = ''
        }
    }
)

watch(
    () => userDetails.email,
    (newVal) => {
        if(newVal.length < 1){
            state.emailError = 'Email is required'
            return
        }
        const emailMatcher = /[^@]+@+./
        if(!emailMatcher.test(newVal) || newVal.includes(' ')){
            state.emailError = 'Invalid email'
        } else {
            state.emailError = ''
        }
    }
)


</script>

<template>

    <div class="p-fluid m-2 ">
        <div class="flex justify-content-center align-items-center">
            <UserImage :img-src="userDetails.imageUrl" @new-image="newImageEmitHandler" :key="userDetails.imageUrl"/>
        </div>
        <CountrySelect :user-cca3="userDetails.cca3" @change="userCountryChanged" class="mt-4" />
        <FloatLabel class="mt-4">
            <label for="userName">Username</label>
            <InputText id="userName" v-model="userDetails.userName" maxlength="80"/>
            <p v-if="state.userNameError" class="text-red-600 helperText">{{ state.userNameError }}</p>
        </FloatLabel>
        <FloatLabel class="mt-4">
            <label for="email">Email</label>
            <InputText id="email" v-model="userDetails.email"/>
            <p v-if="state.emailError" class="text-red-600 helperText mb-0">{{ state.emailError }}</p>
        </FloatLabel>
        <Button class="mt-4" label="save" @click.prevent="saveChangedUserDetails" :disabled=userChanged></Button>
        <Button class="mt-2" label="cancel" @click.prevent="resetChangesClickHandler" :disabled=userChanged></Button>
    </div>
</template>

<style scoped>
.helperText {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    color: #ef4444;
}
</style>