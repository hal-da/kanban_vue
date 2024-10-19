<script setup>

import {computed, onUnmounted, reactive} from "vue";
import {NEW_BOARD_COLUMN_NAMES, routes, url} from "@/components/utilities/constants.js";
import {useAuthStore} from "@/stores/authorization.js";
import {usePrivateBoardStore} from "@/stores/privateBoardStore.js";
import {usePublicBoardsStore} from "@/stores/publicBoards.js";
import UserList from "@/components/boards/UserList.vue";
import router from "@/router/index.js";
import {useToast} from 'primevue/usetoast';
import {useConfirm} from "primevue/useconfirm";

const toast = useToast();
const confirm = useConfirm();

const publicBoardsStore = usePublicBoardsStore()
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


if (mode === 'create') {
    original_board.members = [authStore.user]
    original_board.admins = [authStore.user]
    original_board.columns = []
    let i = 0
    NEW_BOARD_COLUMN_NAMES.forEach(name => {
        original_board.columns.push({title: name, wipLimit: 2, tasks: [], order: i})
        i++
    })
}


const state = reactive({
    loading: false,
    privateBoardCopy: JSON.parse(JSON.stringify(original_board)),
    newColumn:{
        title: '',
        wipLimit: 2,
        tasks: [],
        order: original_board.columns.length
    },
    draggableColumn: {}

})


const boardCopyWasChanged = computed(() => {
    if (!state.privateBoardCopy.title) return false
    if (!state.privateBoardCopy.members.length || !state.privateBoardCopy.admins.length) return false
    return JSON.stringify(state.privateBoardCopy) !== JSON.stringify(original_board)
})


const editBoardCLickHandler = async () => {
    state.loading = true
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
        const res = await updateColumns(state.privateBoardCopy.id)
        if(res.success) toast.add({ severity: 'success',group: 'bl', summary: 'Success', detail: 'Board was successfully updated' , life: 3000 });
        emit('cancel')
    } else if (res.ok)  {
        const newBoard = await res.json();
        await updateColumns(newBoard.id)
        await publicBoardsStore.fetchPublicBoards()
        toast.add({ severity: 'success',group: 'bl', summary: 'Success', detail: 'Board was successfully created' , life: 3000 });
        emit('cancel')
        await router.push({name: 'board', params: {id: newBoard.id}})
    } else {
        const errorMessage = await res.json()
        toast.add({severity: 'error', group: 'bl', summary: 'Error', detail: errorMessage.error, life: 3000});
    }

    await usePrivateBoardStore().refreshBoard()
    state.loading = false
}

const updateColumns = async (boardId) => {

    const columnPromises = state.privateBoardCopy.columns.map((column) => {
        const columnRoute = url + routes.ROUTE_COLUMNS(boardId);

        return fetch(columnRoute, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authStore.authToken}`,
            },
            body: JSON.stringify(column),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to post column with status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                toast.add({severity: 'error', group: 'bl', summary: 'Error', detail: error, life: 3000});
                throw error;
            });
    });

    try {
        const result = await Promise.all(columnPromises);
        return {success: true, result};
    } catch (error) {
        return new Promise((resolve, reject) => {
            reject(error)
        })
    }
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

const addNewColumnClickHandler = async () => {
    state.privateBoardCopy.columns.push(state.newColumn)
    state.newColumn = {
        title: '',
        wipLimit: 2,
        tasks: [],
        order: state.privateBoardCopy.columns.length
    }
}

const dragenter = (e) => {
    let p = findAncestor(e.target, 'dropzone')
    p.classList.add('dragEnter')
}

const dragleave = () => {
    const allDropzones = document.querySelectorAll('.dragEnter')
    allDropzones.forEach(dropzone => {
        dropzone.classList.remove('dragEnter')
    })
}

const onDrop = (e) => {
    const dropzone = findAncestor(e.target, 'dropzone')
    const dropZoneIndex = Number(dropzone.getAttribute('data-col-index')) + 1
    state.privateBoardCopy.columns.splice(dropZoneIndex, 0, state.draggableColumn.value)
    const oldIndex = state.draggableColumn.value.order
    if(oldIndex < dropZoneIndex){
        state.privateBoardCopy.columns.splice(oldIndex, 1)
    } else {
        state.privateBoardCopy.columns.splice(oldIndex + 1, 1)
    }
    state.privateBoardCopy.columns.forEach((column, i) => {
        column.order = i
    })
    dragleave()
}

const onStartDrag = (column) => {
    state.draggableColumn.value = column
}

function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

const confirmDeleteBoard = () => {
    confirm.require({
        message: 'Do you really want to delete this Board?',
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
        accept: async () => {
            await deleteBoard()
        },
        reject: () => {
            console.log('reject')
            // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

const deleteBoard = async () => {
    state.loading = true
    const route = url + routes.ROUTE_BOARDS + '/' + state.privateBoardCopy.id
    const res = await fetch(route, {
        method: 'DELETE',
        headers: {Authorization: `Bearer ${authStore.authToken}`}
    })
    console.log(res)y
    if (res.ok) {
        toast.add({severity: 'success', group: 'bl', summary: 'Success', detail: 'Board was successfully deleted', life: 3000});
        emit('cancel')
        await publicBoardsStore.fetchPublicBoards()
        state.loading = false
        await router.push({name: 'home'})
    } else {
        const errorMessage = await res.json()
        toast.add({severity: 'error', group: 'bl', summary: 'Error', detail: errorMessage.error, life: 3000});
        state.loading = false
    }

}


</script>

<template>
    <div class="p-fluid dialogBackground">
        <div class="flex flex-row justify-content-between align-items-center">
            <h3 class="mb-4">{{ title }}</h3>
            <div v-if="mode==='edit'"><Button :loading="state.loading" severity="danger" @click="confirmDeleteBoard">Delete Board</Button></div>
        </div>
        <FloatLabel class="mt-3">
            <InputText v-model="state.privateBoardCopy.title" id="boardTitle" autofocus minlength="1" maxlength="80"/>
            <label for="boardTitle" style="background-color: #262626; color: white">Board Title</label>
        </FloatLabel>

        <div class="help text-right">{{ state.privateBoardCopy.title.length }}/80</div>
        <div class="flex justify-content-between gap-3">
            <UserList :title="'Admins'" @change="adminsChanged" :users="state.privateBoardCopy.admins"/>
            <UserList :title="'Members'" @change="membersChanged" :users="state.privateBoardCopy.members"/>
        </div>

        <h4 class="mb-1">Columns</h4>
        <div  v-for="(column, i) in state.privateBoardCopy.columns" class="my-2 dropzone"
              @drop.prevent="onDrop"  @dragenter.prevent @dragover.prevent :data-col-index="i" @dragstart="onStartDrag(column)">
            <InputGroup class="flex"  @dragenter.stop="dragenter" @dragleave.stop="dragleave" draggable="true">
                <InputGroupAddon class="grabDrag">
                    <i class="pi pi-arrows-v "></i>
                </InputGroupAddon>
                <FloatLabel class="flex-grow-1">
                    <InputText v-model="column.title" id="columnTitle" autofocus minlength="1" maxlength="80" class="flex-grow-1"/>
                    <label for="columnTitle" style="background-color: #262626; color: white">Title</label>
                </FloatLabel>
                <FloatLabel class="flex-shrink-1" style="max-width: 200px">
                    <InputNumber v-model="column.wipLimit" id="columnWipLimit" :min="0" :max="100" mode="decimal" style="max-width:200px" class="flex-shrink-1"
                                 show-buttons />
                    <label for="columnWipLimit" style="background-color: #262626; color: white">WIP Limit</label>
                </FloatLabel>
            </InputGroup>
        </div>

        <h4 class="my-1">Add column</h4>
        <InputGroup class="mt-1 flex" >

            <Button icon="pi pi-plus-circle " severity="success" @Click="addNewColumnClickHandler" :disabled="!state.newColumn.title" />
            <FloatLabel class="flex-grow-1">
                <InputText v-model="state.newColumn.title" id="newColumnTitle" autofocus minlength="1" maxlength="80" class="flex-grow-1"/>
                <label for="newColumnTitle" style="background-color: #262626; color: white">Title</label>
            </FloatLabel>
            <FloatLabel class="flex-shrink-1" style="max-width: 200px">
                <InputNumber v-model="state.newColumn.wipLimit" id="newColumnWipLimit" :min="0" :max="100" mode="decimal" style="max-width:200px" class="flex-shrink-1"
                             show-buttons />
                <label for="newColumnWipLimit" style="background-color: #262626; color: white">WIP Limit</label>
            </FloatLabel>

        </InputGroup>

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

.grabDrag {
    cursor: grab;
}

.dragEnter {
    border-bottom: 1px solid red;
}

.dropzone {
    padding-bottom: 10px;
}
</style>