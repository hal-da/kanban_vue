<script setup>

import {computed, reactive} from "vue";
import {routes, url} from "@/components/utilities/constants.js";
import {useAuthStore} from "@/stores/authorization.js";
import {usePrivateBoardStore} from "@/stores/privateBoardStore.js";

const privateBoardStore = usePrivateBoardStore()
const authStore = useAuthStore();
const {original_board } = defineProps(['original_board'])
const state = reactive({
    loading: false,
    privateBoardCopy: {...original_board}
})


const boardCopyWasChanged = computed(() => {
    return JSON.stringify(state.privateBoardCopy) !== JSON.stringify(original_board)
})

const emit = defineEmits(['cancel'])



const editBoardCLickHandler = async () => {
    const route = url + routes.ROUTE_BOARDS + '/' + original_board.id
    console.log(route)
    console.log(JSON.stringify(state.privateBoardCopy))
    const res = await fetch(url + routes.ROUTE_BOARDS, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.authToken}`
        },
        body: JSON.stringify(state.privateBoardCopy)
    })
    if(res.ok) {
        await privateBoardStore.refreshBoard()
        emit('cancel')
    }
}

</script>

<template>
    <div class="p-fluid">
        <FloatLabel class="mt-3">
            <InputText v-model="state.privateBoardCopy.title" id="boardTitle" minlength="1" maxlength="80"/>
            <label for="boardTitle" style="background-color: #262626; color: white">Board Title</label>
            <div class="help text-right">{{state.privateBoardCopy.title.length}}/80</div>
        </FloatLabel>
        <div class="flex-row flex-wrap align-items-center justify-content-end">
            <Button @click="editBoardCLickHandler"
                    :disabled="!boardCopyWasChanged"
                    class="mt-4 ml-auto px-3 text-center"
                    icon="pi pi-check"
                    :loading="state.loading" label="save  "/>
            <Button @click="$emit('cancel')"
                    class="mt-4 ml-auto px-3 text-center"
                    icon="pi pi-check"
                    :loading="state.loading" label="cancel"/>
        </div>
    </div>
</template>

<style scoped>

</style>