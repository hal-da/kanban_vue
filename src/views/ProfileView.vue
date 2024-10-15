<script setup>
import { useToast } from 'primevue/usetoast';
import {useAuthStore} from "@/stores/authorization.js";
import {storeToRefs} from "pinia";
import UserImage from "@/components/auth/UserImage.vue";

const authStore = useAuthStore()
const userDetails = authStore.userDetails

const toast = useToast();


</script>
<template>

    <UserImage />
<pre>{{userDetails}}</pre>




</template>

<style>
</style>
