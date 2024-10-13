<script setup>
import { usePrivateBoardStore} from "@/stores/privateBoardStore.js";
import {storeToRefs} from "pinia";
import Task from "@/components/tasks/Task.vue";
import {computed, reactive} from "vue";
import { useConfirm } from "primevue/useconfirm";
import {routes, url} from "@/components/utilities/constants.js";
import {useAuthStore} from "@/stores/authorization.js";
import {useToast} from "primevue/usetoast";
import Dialog from "primevue/dialog";

const privateBoardStore = usePrivateBoardStore()
const {privateBoard} = storeToRefs(privateBoardStore)
const props = defineProps(['column'])
const confirm = useConfirm();
const authStore = useAuthStore();
const toast = useToast();


const state = reactive({
    newColumnTitle: props.column.title || '',
    newColumnWipLimit: props.column.wipLimit || 2,
    displayEditColumnDialog: false,
    dragEnter: false
})

const openEditColumnDialog = () => {
    state.displayEditColumnDialog = true
}

const editColumnClickHandler = async () => {
    const r = url + routes.ROUTE_COLUMN(privateBoard.value.id, props.column.id)
    const res = await fetch(r , {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.authToken}`
        },
        body: JSON.stringify({
            title: state.newColumnTitle,
            wipLimit: state.newColumnWipLimit
        })
    })
    if (res.ok) {
        console.log('column updated')
        await privateBoardStore.fetchPrivateBoard(privateBoard.value.id)
        toast.add({ severity: 'success',group: 'bl', summary: 'Success', detail: 'Board was successfully updated' , life: 3000 });
        state.displayEditColumnDialog = false
    } else {
        const error = await res.json()
        toast.add({severity: 'error', group: 'bl', summary: 'Error', detail: error, life: 3000});

    }

}

const cancelEditColumnClickHandler = () => {
    state.newColumnTitle = props.column.title
    state.newColumnWipLimit = props.column.wipLimit
    state.displayEditColumnDialog = false
}

const propertiesChanged = computed(() => {
    return state.newColumnTitle !== props.column.title || state.newColumnWipLimit !== props.column.wipLimit
})


const confirmDeleteColumn = () => {
    confirm.require({
        message: 'Do you really want to delete the Column ' + props.column.title + '?',
        header: 'Danger Zone',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
            // toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
        },
        reject: () => {
            console.log('reject')
            // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};

const dragStart = (e, task) => {
    e.dataTransfer.setData("text", JSON.stringify(task));
    console.log(props.column)
    console.log('dragging', task)
    console.log('from column', props.column.id)
}

const dragEnter = () => {
    state.dragEnter = true
}

const drop = async (e) => {
    state.dragEnter = false
    const task = JSON.parse(e.dataTransfer.getData("text"))

    if (task.columnId === props.column.id) return

    task.columnId = props.column.id

    const res = await privateBoardStore.updateTask(task)
    console.log(res)
    if(res.success) {
        toast.add({ severity: 'success',group: 'bl', summary: 'Success', detail: 'Task was successfully moved' , life: 3000 });
    } else {
        toast.add({severity: 'error', group: 'bl', summary: 'Error', detail: res.message, life: 3000});
    }
    console.log('dropped', task)
    console.log('to column', props.column.id)
}

</script>

<template>
    <div :class="['column',' m-1', 'dropzone-column', state.dragEnter ? 'dragEnter' : ''  ]"
         @dragenter.prevent="dragEnter"
         @dragleave.stop="state.dragEnter = false"
         @dragover.prevent
         @drop="drop"
    >
        <div class="flex">
            <h3 class="pl-2">{{props.column.title}} </h3>
            <div class="ml-auto py-2 mr-2">
                <span class="pr-0" style="font-size:small">Limit: {{props.column.wipLimit}}</span>
                <i v-if="privateBoard?.userIsAdmin" class="pi pi-cog ml-2 editBoard text-primary-600" @click="openEditColumnDialog"/>
            </div>

        </div>
        <Divider class="mt-0"/>
        <Task v-for="task in props.column.tasks"
              :task="task"
              :column-id="props.column.id"
              :key="task.id"
              class="grabbable"
              draggable="true"
              @dragstart="dragStart($event,task)"
        />
        <Dialog v-model:visible="state.displayEditColumnDialog" modal header="Edit Column" :style="{ width: '50vw' }" @hide="cancelEditColumnClickHandler"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="p-fluid">
                <Button class="p-button-danger "  severity="danger" @click="confirmDeleteColumn" > Delete Column</Button>
                <FloatLabel class="mt-3">
                    <InputText id="columnTitle" v-model="state.newColumnTitle" />
                    <label for="columnTitle" style="background-color: #262626; color: white">Title</label>
                </FloatLabel>
                <FloatLabel class="mt-4">
                    <InputNumber id="columnWipLimit" v-model="state.newColumnWipLimit" :min="0" :max="100" mode="decimal" />
                    <label for="columnWipLimit" style="background-color: #262626; color: white">Wip Limit</label>
                </FloatLabel>
                <div class="flex  gap-2 align-items-center justify-content-end">
                    <Button @click="cancelEditColumnClickHandler"
                            class="mt-4 ml-auto px-3 text-center"
                            icon="pi pi-check"
                            label="cancel"/>
                    <Button @click="editColumnClickHandler"
                            :disabled="!propertiesChanged"
                            class="mt-4 ml-auto px-3 text-center"
                            icon="pi pi-check"
                            label="Save"/>
                </div>
            </div>
        </Dialog>
        <ConfirmPopup></ConfirmPopup>
<!--        <pre>{{ column }}</pre>-->
    </div>
</template>

<style scoped>
.column {
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    height: calc(100vh - 200px);
}
.editBoard {
    cursor: pointer;
}

.grabbable {
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
}

/* (Optional) Apply a "closed-hand" cursor during drag operation. */
.grabbable:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}

.dragEnter {
    background-color:#1c1b1b;
}

</style>