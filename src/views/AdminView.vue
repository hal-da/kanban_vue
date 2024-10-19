<script setup>

import {onMounted, reactive} from "vue";
import {url} from "@/components/utilities/constants.js";

const state = reactive({
    users: []
})

onMounted(async () => {
    const result = await fetch(url + 'admin/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('kanbantastischAuthToken')
        }
    })
    state.users = await result.json()
})

</script>

<template>
    <div>
        <h1>Admin Panel</h1>
        <pre>{{state.users}}</pre>
    </div>
</template>

<style scoped>

</style>