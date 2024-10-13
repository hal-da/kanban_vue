<script setup>
import { useToast } from 'primevue/usetoast';
import {useAuthStore} from "@/stores/authorization.js";
import {storeToRefs} from "pinia";

const authStore = useAuthStore()
const userDetails = authStore.userDetails

const toast = useToast();


</script>
<template>
<pre>{{userDetails}}</pre>




</template>

<style>
</style>
