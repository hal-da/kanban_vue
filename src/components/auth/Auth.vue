<script setup>

import { reactive } from "vue";
import {useAuthStore} from "@/stores/authorization.js";
import {usePublicBoardsStore} from "@/stores/publicBoards.js";
import router from "@/router/index.js";
import {usePrivateBoardStore} from "@/stores/privateBoardStore.js";
import {storeToRefs} from "pinia";
import EditBoard from "@/components/boards/EditBoard.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const privateBoardStore = usePrivateBoardStore()
const {privateBoard} = storeToRefs(privateBoardStore)


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
    loginError: '',
    emailError: '',

})

const loginClickHandler = async () => {
    state.loading = true
    const res = await authStore.login(state.email, state.password)
    if (res.success) {
        state.displayLoginDialog = false
        toast.add({ severity: 'success', summary: 'Welcome',group: 'bl', detail: `Welcome back, ${authStore.user.userName}` , life: 3000 });
    }
    else {
        state.loginError = res.message
    }
    await publicBoardsStore.fetchPublicBoards()
    state.loading = false
}

const logoutClickHandler = async () => {
    state.displayRegisterDialog = false
    state.displayLoginDialog = false

    toast.add({ severity: 'success',group: 'bl', summary: 'Goodbye ' + authStore.user.userName + '!' , detail: `Have a nice day!` , life: 3000 });
    router.push({name: 'home'}).then(()=>{
        authStore.logout()
    })
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



const clickOpenLoginDialogHandler = () => {
  state.loginError = ''
  state.displayLoginDialog = true
}

const pushToAdminView = () => {
    router.push({name: 'admin'})
}



</script>

<template>
    <div v-if="authStore.isLoggedIn">
        <Button v-if="authStore.user.role === 'ADMIN'" @click="pushToAdminView" text class="pr-0">Admin panel</Button>
        <Button v-if="!Object.values(privateBoard).length" text class="pr-0" @click="state.displayCreateBoardModal = true">create board</Button>
        <Button text disabled class="pr-0">hello, {{ authStore.user.userName }}</Button>
        <Button text disabled class="pr-0">v0.1</Button>
        <Button @click="logoutClickHandler" text>logout</Button>
        <Dialog v-model:visible="state.displayCreateBoardModal" modal header="Create Board" :style="{ width: '50rem'}" :breakpoints="{ '1199px': '75vw', '575px': '100vw' }">
            <EditBoard :mode="'create'" @cancel="cancelCreateBoardClickHandler" @close="closeCreateBord" :title="'Create Board'"/>
        </Dialog>
    </div>
    <div v-else>
        <Button @click="state.displayRegisterDialog = !state.displayRegisterDialog" text>Register</Button>
        <Button @click="clickOpenLoginDialogHandler" text>Login</Button>
        <Dialog v-model:visible="state.displayLoginDialog" modal header="Login" :style="{ width: '50vw' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="p-fluid">
                <FloatLabel class="mt-3">
                    <InputText id="email" v-model="state.email" @change="state.loginError = ''" />
                    <label for="email" style="background-color: #262626; color: white">Email</label>
                    <p v-if="state.emailError" class="text-red-600">{{ state.emailError }}</p>
                </FloatLabel>
                <FloatLabel class="mt-4">
                    <Password id="password" v-model="state.password" @change="state.loginError = ''"  :feedback="false" />
                    <label for="password" style="background-color: #262626; color: white">Password</label>
                </FloatLabel>
                <div class="flex flex-wrap align-items-center justify-content-end">
                  <Button @click="loginClickHandler"
                          :disabled="state.email.length < 1 || state.password.length < 1 || state.loading || state.loginError || !state.email.includes('@')"
                            class="mt-4 ml-auto px-3 text-center"
                            icon="pi pi-check"
                  :loading="state.loading" label="login"/>
                  <p v-if="state.loginError" class="mb-0 text-red-600">{{state.loginError}}</p>
                </div>
            </div>
        </Dialog>
        <Dialog v-if="useAuthStore" v-model:visible="state.displayRegisterDialog" modal header="Register" :style="{ width: '50vw' }"
                :breakpoints="{ '1199px': '75vw', '575px': '100vw' }">
            <RegisterForm/>
        </Dialog>
    </div>
</template>

<style scoped>
.help {
    font-size: 12px;
    color: gray;
}

.p-dialog-header{
    padding-bottom:0;
}

</style>