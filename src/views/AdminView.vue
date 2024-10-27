<script setup>

import {onMounted, reactive} from "vue";
import {localStorageKeys, routes, url} from "@/components/utilities/constants.js";
import {imageService} from "@/components/utilities/services.js";
import UserImage from "@/components/auth/UserImage.vue";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import {usePublicBoardsStore} from "@/stores/publicBoards.js";
import DataTableUser from "@/components/admin/DataTableUsers.vue";
import DataTableBoards from "@/components/admin/DataTableBoards.vue";
const {publicBoards} = usePublicBoardsStore()
const confirm = useConfirm();
const toast = useToast();

const state = reactive({
    users: []
})

onMounted(async () => {
    await fetchUsers()
})

const confirmDelete = async (event, id) => {
    console.log(id)
    confirm.require({
        target: event.currentTarget,
        message: 'Do you want to delete this record?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        accept: () => {
            deleteUser(id)
        },
        reject: () => {
        }
    });
}

const fetchUsers = async ()=> {
    const result = await fetch(url + 'admin/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem(localStorageKeys.LS_AUTH_TOKEN)
        }
    })
    state.users = await result.json()
    state.users.map(async user => {
        return {...user, imageUrl: URL.createObjectURL(await imageService(user.imageUrl))}
    });
}

const parseDate = (date) => {
    return new Date(date).toLocaleDateString('de-AT')
}

const deleteUser = async (id) => {
    const result = await fetch(url + routes.ROUTE_USERS + '/'+id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem(localStorageKeys.LS_AUTH_TOKEN)
        }
    })
    console.log(result)
    if (result.status === 204) {
        state.users = state.users.filter(user => user.id !== id)
        toast.add({ severity: 'success',group: 'bl', summary: 'Success', detail: 'User deleted!' , life: 3000 });
    } else {
        toast.add({severity: 'error', group: 'bl', summary: 'Error', detail: 'User could not be deleted!', life: 3000});
    }
}


</script>

<template>
    <div>
        <h1>Admin Panel</h1>
        <ConfirmPopup></ConfirmPopup>
        <DataTableUser :confirm-delete="confirmDelete" :parse-date="parseDate" :users="state.users" title="Users" />
        <DataTableBoards :confirm-delete="confirmDelete" :boards="publicBoards"  :parse-date="parseDate"/>
        <pre>{{publicBoards}}</pre>
    </div>
</template>

<style scoped>

</style>