<script setup>

import {computed, onMounted, onUnmounted, reactive} from "vue";
import {routes, url} from "@/components/utilities/constants.js";
import {useAuthStore} from "@/stores/authorization.js";
import {usePrivateBoardStore} from "@/stores/privateBoardStore.js";
import {usePublicBoardsStore} from "@/stores/publicBoards.js";
import UserList from "@/components/boards/UserList.vue";
import router from "@/router/index.js";

const publicBoardsStore = usePublicBoardsStore()
const privateBoardStore = usePrivateBoardStore()
const authStore = useAuthStore();
const emit = defineEmits(['cancel', 'close', 'create'])

const {original_board, mode} = defineProps({
    original_board: {
        type: Object,
        default: () => ({
            title: '',
            members: [],
            admins: []
        })
    },
    mode: {
        value: 'edit' | 'create',
        default: 'edit'
    },
    title: {
        value: 'Edit Board' | 'Create Board',
    }
})

onMounted(() => {
    state.privateBoardCopy = {...original_board}
})

if (mode === 'create') {
    original_board.members = [authStore.user]
    original_board.admins = [authStore.user]
}

console.log(original_board)
const state = reactive({
    loading: false,
    privateBoardCopy: {...original_board}
})


const boardCopyWasChanged = computed(() => {
    console.log(state.privateBoardCopy.admins)
    if (!state.privateBoardCopy.title) return false
    if(!state.privateBoardCopy.members.length || !state.privateBoardCopy.admins.length) return false
    return JSON.stringify(state.privateBoardCopy) !== JSON.stringify(original_board)
})



const editBoardCLickHandler = async () => {
    const method = mode === 'edit' ? 'PUT' : 'POST'
    const route = url + routes.ROUTE_BOARDS
    const payload = {...state.privateBoardCopy}
    const res = await fetch(route, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.authToken}`
        },
        body: JSON.stringify(payload)
    })

    if (res.ok && method === 'PUT') {
        emit('cancel')
    } else if (res.ok) {
        const newBoard = await res.json()
        await publicBoardsStore.fetchPublicBoards()
        await router.push({name: 'board', params: {id: newBoard.id}})
        emit('close')
    }else console.error('error', res)
    // todo: error handling, toasts
}

const closeClickHandler = () => {
    emit('cancel')
}

onUnmounted(() => {
    emit('cancel', 'escape')
})

const membersChanged = (members) => {
    state.privateBoardCopy.members = members
}

const adminsChanged = (admins) => {
    state.privateBoardCopy.admins = admins
}

</script>

<template>
    <div class="p-fluid dialogBackground">
        <h3 class="mb-4">{{ title }}</h3>
        <FloatLabel class="mt-3">
            <InputText v-model="state.privateBoardCopy.title" id="boardTitle" autofocus minlength="1" maxlength="80"/>
            <label for="boardTitle" style="background-color: #262626; color: white">Board Title</label>
            <div class="help text-right">{{ state.privateBoardCopy.title.length }}/80</div>
            <div class="flex justify-content-between gap-3">
                <UserList :title="'Admins'" @change="adminsChanged" :users="state.privateBoardCopy.admins"/>
                <UserList :title="'Members'" @change="membersChanged" :users="state.privateBoardCopy.members"/>
            </div>
        </FloatLabel>
        <div class="flex-row flex-wrap align-items-center justify-content-end">
            <Button @click="editBoardCLickHandler"
                    :disabled="!boardCopyWasChanged"
                    class="mt-4 ml-auto px-3 text-center"
                    icon="pi pi-check"
                    :loading="state.loading" label="save  "/>
            <Button @click="closeClickHandler"
                    class="mt-4 ml-auto px-3 text-center"
                    icon="pi pi-check"
                    :loading="state.loading" label="cancel"/>
        </div>
    </div>
</template>

<style scoped>
.dialogBackground {
    background-color: #262626;
    padding: 1rem;
    border: 1px solid #262626;
    border-radius: 5px;
}
</style>