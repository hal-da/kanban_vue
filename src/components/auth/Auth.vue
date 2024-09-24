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
import { useToast } from 'primevue/usetoast';

const toast = useToast();
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
    loginError: ''

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
    state.loading = false
}

const logoutClickHandler = async () => {
  toast.add({ severity: 'success',group: 'bl', summary: 'Goodbye', detail: `Have a nice day!` , life: 3000 });
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

const clickOpenLoginDialogHandler = () => {
  state.loginError = ''
  state.displayLoginDialog = true
}

</script>

<template>
    <div v-if="authStore.isLoggedIn">
        <Button v-if="privateBoard?.userIsAdmin" text class="pr-0" @click="openEditBoardClickHandler">edit board</Button>
        <Button v-if="!Object.values(privateBoard).length" text class="pr-0" @click="state.displayCreateBoardModal = true">create board</Button>
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
        <Button @click="clickOpenLoginDialogHandler" text>Login</Button>
        <Dialog v-model:visible="state.displayLoginDialog" modal header="Login" :style="{ width: '50vw' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="p-fluid">
                <FloatLabel class="mt-3">
                    <InputText id="email" v-model="state.email" @change="state.loginError = ''" />
                    <label for="email" style="background-color: #262626; color: white">Email</label>
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