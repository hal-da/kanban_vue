<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {usePrivateBoardStore} from "@/stores/privateBoardStore.js";
import {useAuthStore} from "@/stores/authorization.js";
import {storeToRefs} from "pinia";
import {routes, url} from "@/components/utilities/constants.js";
import { useToast } from 'primevue/usetoast';
import EditBoard from "@/components/boards/EditBoard.vue";
import ColumnComponent from "@/components/columns/ColumnComponent.vue";

const toast = useToast();

const privateBoardStore = usePrivateBoardStore()
const authStore = useAuthStore()

const props = defineProps({
    id: String
})

const state  = reactive({
    newTaskDialog: false,
    newTaskTitle: '',
    newTaskDescription: '',
    newTaskColumnId: '',
    displayEditBoardModal: false
})
const {privateBoard} = storeToRefs(privateBoardStore)

onMounted(async () => {
    const res = await usePrivateBoardStore().fetchPrivateBoard(props.id)
    if(!res.success){
        console.log(res)
        console.log('error fetching private board')
    }
})

const newTaskColumnOptions = computed(() => {
    return privateBoard.value.columns.map(column => {
        return {
            label: column.title,
            value: column.id
        }
    })
})

const saveBtnDisabled = computed(() => {
    return state.newTaskTitle.length < 1
        // || state.newTaskDescription.length < 1
        || state.newTaskColumnId.length < 1
})

const showDialogNewTaskClickHandler = () => {
    state.newTaskColumnId = privateBoard.value.columns[0].id
    state.newTaskDialog = true
}

const saveNewTaskClickHandler = async () => {
    const newTaskUrl = url + routes.ROUTE_TASKS(props.id, state.newTaskColumnId)
    const httpMethod = 'POST'
    const body = {
        title: state.newTaskTitle,
        description: state.newTaskDescription,
        columnId: state.newTaskColumnId
    }

    const res = await fetch(newTaskUrl, {
        method: httpMethod,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.authToken}`
        },
        body: JSON.stringify(body)
    })
    if(res.ok){
        toast.add({ severity: 'success',group: 'bl', summary: 'Success', detail: 'Task created successfully!' , life: 3000 });
        await privateBoardStore.refreshBoard()
        newTaskDialogClosed()
    } else {
        const body = await res.json()
        toast.add({ severity: 'error',group: 'bl', summary: 'Error', detail: body.error , life: 3000 });
    }
}

const newTaskDialogClosed = () => {
    state.newTaskDescription = ''
    state.newTaskTitle = ''
    state.newTaskDialog = false
}

const openEditBoardDialogClickHandler = () => {
    state.displayEditBoardModal = true
}

const cancelEditBoardClickHandler = () => {
    state.displayEditBoardModal = false
    privateBoardStore.refreshBoard()
}

const screenSize = computed(() => {
    console.log('computed ',window.innerWidth)
    return window.innerWidth
})

window.addEventListener("resize", (event) => {
    console.log('resize ',event)
});

const userIsAdmin = computed(() => {
    console.log(privateBoard?.value.admins?.some(admin => admin.id === authStore.user.id))
    return  privateBoard?.value.admins?.some(admin => admin.id === authStore.user.id)
    // console.log(privateBoard.value.admins)
    // console.log(authStore.user.id)
    // let isAdmin = false
    // privateBoard?.value.admins?.forEach(admin => {
    //     // console.log(admin)
    //     if(admin.id === authStore.user.id){
    //         isAdmin = true
    //     }
    // })
    // // if(privateBoard.value){
    // //     isAdmin = privateBoard.value.admins.some(admin => admin.id === authStore.user.id)
    // // }
    // return isAdmin
})

</script>

<template>
    <div class="flex justify-content-between">
        <Button text  @click="showDialogNewTaskClickHandler">New Task</Button>
        <h2 class="text-center">{{privateBoard.title}}</h2>
        <Button v-if="userIsAdmin"   text  @click="openEditBoardDialogClickHandler">Edit Board</Button>
        <div v-else ></div>
    </div>

    <div class="boardBody flex p-1 gap-1">
        <ColumnComponent v-for="column in privateBoard.columns" :column="column" :key="column.id" class="column-component"/>
    </div>

    <Dialog v-model:visible="state.displayEditBoardModal" modal header="Edit Board" :style="{ width: '50rem'}" :breakpoints="{ '1199px': '75vw', '575px': '100vw' }">
        <EditBoard :original_board="privateBoard"  @cancel="cancelEditBoardClickHandler" :title="'Edit Board'"/>
    </Dialog>
    <Dialog v-model:visible="state.newTaskDialog"
            modal
            @hide="newTaskDialogClosed"
            :style="{ width: '50vw' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
            header = "New Task"
    >
        <div class="p-fluid">
            <div class="p-field mb-3" >
                <label for="title">Title</label>
                <InputText id="title" v-model="state.newTaskTitle"/>
            </div>
            <div class="p-field mb-3">
                <label for="description">Description</label>
                <Textarea id="description" v-model="state.newTaskDescription" rows="5" cols="30"/>
            </div>
                <div class="p-field mb-3">
                    <label for="columnSelect">Create in column</label>
                    <Dropdown v-model="state.newTaskColumnId" :options="newTaskColumnOptions" optionLabel="label" option-value="value" class="w-full md:w-56" id="columnSelect" />
                </div>
            <div class="flex justify-content-end">
                <Button label="Cancel" @click="newTaskDialogClosed"/>
                <Button label="Save" :disabled="saveBtnDisabled" class="ml-2" @click="saveNewTaskClickHandler"/>
            </div>
        </div>
    </Dialog>

<!--    <pre>-->
<!--        {{// privateBoard}}-->
<!--    </pre>-->
</template>

<style scoped>
.boardBody {
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    height: calc(100vh - 150px);
    overflow: auto;
}

.column-component {
    min-width: 300px;
}
</style>