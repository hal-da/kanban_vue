<script setup>

import {computed, reactive, ref} from "vue";
import {useAuthStore} from "@/stores/authorization.js";
import {url, routes} from "@/components/utilities/constants.js";
import {usePublicBoardsStore} from "@/stores/publicBoards.js";
import router from "@/router/index.js";
import {usePrivateBoardStore} from "@/stores/privateBoardStore.js";
import {storeToRefs} from "pinia";
import EditBoard from "@/components/boards/EditBoard.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";

const privateBoardStore = usePrivateBoardStore()
const {privateBoard} = storeToRefs(privateBoardStore)

const privateBoardCopy = ref({})

const authStore = useAuthStore();
const publicBoardsStore = usePublicBoardsStore()

const state = reactive({
    boardWasChanged: false,
    displayEditBoardModal: false,
    displayCreateBoardModal: false,
    displayLoginDialog: false,
    displayRegisterDialog: false,
    password: '',
    email: '',
    loading: false,
    newBoardTitle: '',
    originalBoardToCompareWithChangedBoard: {},

})

const loginClickHandler = async () => {
    state.loading = true
    const res = await authStore.login(state.email, state.password)
    if (res.success) {
        state.displayLoginDialog = false
    }
    state.loading = false
}

const createBoardCLickHandler = async () => {
    const res = await fetch(url + routes.ROUTE_BOARDS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.authToken}`
        },
        body: JSON.stringify({
            title: state.newBoardTitle
        })
    })
    // TODO: spinner, toast, error handling
    if (res.ok) {
        const newBoard = await res.json()
        await publicBoardsStore.fetchPublicBoards()
        state.displayCreateBoardModal = false
        await router.push({name: 'board', params: {id: newBoard.id}})
    }
}


const logoutClickHandler = async () => {
    await authStore.logout()
    await router.push({name: 'home'})
}

const openEditBoardClickHandler = () => {
    privateBoardCopy.value = {...privateBoard.value}
    state.displayEditBoardModal = !state.displayEditBoardModal
}

const cancelEditBoardClickHandler = (e) => {
    state.displayEditBoardModal = false
    if(e !== 'created') privateBoardStore.refreshBoard()
}

const cancelCreateBoardClickHandler = () => {
    state.displayCreateBoardModal = false
}

const closeCreateBord = () => {
    state.displayCreateBoardModal = false
}

const createEventHandler = (e) => {
    console.log('create event handler', e)
    // state.displayCreateBoardModal = false
    // state.displayEditBoardModal = false

}


</script>

<template>
    <div v-if="authStore.isLoggedIn">
        <Button v-if="privateBoard?.userIsAdmin" text class="pr-0" @click="openEditBoardClickHandler">edit board
        </Button>
        <Button v-if="!Object.values(privateBoard).length" text class="pr-0"
                @click="state.displayCreateBoardModal = !state.displayCreateBoardModal">create board
        </Button>
        <Button text disabled class="pr-0">hello, {{ authStore.user.userName }}</Button>
        <Button @click="logoutClickHandler" text>logout</Button>
        <Dialog v-model:visible="state.displayCreateBoardModal"
                modal
                :style="{ width: '50vw' }"
                @close="cancelEditBoardClickHandler"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #container="{  }">
                <EditBoard :mode="'create'" @cancel="cancelCreateBoardClickHandler" @close="closeCreateBord" :title="'Create Board'"/>
            </template>
        </Dialog>
        <Dialog v-model:visible="state.displayEditBoardModal"
                modal
                :style="{ width: '50vw' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
                @close="cancelEditBoardClickHandler"
        >
            <template #container="{  }">
                <EditBoard :original_board="privateBoard" @cancel="cancelEditBoardClickHandler" @create="createEventHandler" :title="'Edit Board'"/>
            </template>
        </Dialog>
    </div>
    <div v-else>
        <Button @click="state.displayRegisterDialog = !state.displayRegisterDialog" text>Register</Button>
        <Button @click="state.displayLoginDialog = !state.displayLoginDialog" text>Login</Button>
        <Dialog v-model:visible="state.displayLoginDialog" modal header="Login" :style="{ width: '50vw' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="p-fluid">
                <FloatLabel class="mt-3">
                    <InputText id="email" v-model="state.email"/>
                    <label for="email" style="background-color: #262626; color: white">Email</label>
                </FloatLabel>
                <FloatLabel class="mt-4">
                    <Password id="password" v-model="state.password"/>
                    <label for="password" style="background-color: #262626; color: white">Password</label>
                </FloatLabel>
                <div class="flex flex-wrap align-items-center justify-content-end">
                    <Button @click="loginClickHandler"
                            class="mt-4 ml-auto px-3 text-center" #
                            icon="pi pi-check"
                            :loading="state.loading" label="login"/>
                </div>
            </div>
        </Dialog>
        <Dialog v-model:visible="state.displayRegisterDialog" modal header="Register" :style="{ width: '50vw' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <RegisterForm/>
        </Dialog>
    </div>
</template>

<style scoped>
.help {
    font-size: 12px;
    color: gray;
}

</style>