<script setup>
import { watchDebounced } from '@vueuse/core'
import {url, routes} from "@/components/utilities/constants.js";
import {usePrivateBoardStore} from "@/stores/privateBoardStore.js";
import {storeToRefs} from "pinia";
import {useAuthStore} from "@/stores/authorization.js";
import {useToast} from "primevue/usetoast";
import {ref} from "vue";

const authStore = useAuthStore();
const privateBoardStore = usePrivateBoardStore()
const {privateBoard} = storeToRefs(privateBoardStore)
const props = defineProps(['task', 'columnId'])
const toast = useToast();
const oldTask = ref(JSON.parse(JSON.stringify(props.task)))

const saveTask = async () => {
    const boardId = privateBoard.value.id
    const res = await fetch(
        url + routes.ROUTE_TASKS(boardId, props.columnId),
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authStore.authToken}`
            },
            body: JSON.stringify(props.task)
        }
    )
    if (res.ok) {
        toast.add({ severity: 'success',group: 'bl', summary: 'Success', detail: 'Task was successfully updated' , life: 3000 });
    } else {
        const error = await res.json()
        toast.add({severity: 'error', group: 'bl', summary: 'Error', detail: error, life: 3000});
    }
}

watchDebounced(
    () => props,
     (newVal) => {
        if(JSON.stringify(newVal.task) === JSON.stringify(oldTask.value)) return
        saveTask()
    },
    {deep: true, debounce: 1000, maxWait: 20000},
)

</script>

<template>
    <div class="task " >
        <div class="flex justify-content-between">
            <h3 class="m-1">{{props.task.title}} {{ new Date(props.task.lastChangeAt).getTime()}}</h3>
            <i class="pi pi-ellipsis-v pt-2 grab " ></i>
        </div>
        <Divider class="my-0"/>
        <div class="p-1">
            <Textarea v-model="props.task.description" placeholder="description" class="w-full" auto-resize :rows="3    " />
        </div>
        <div>
            <Checkbox id="taskDoneSwitch" v-model="props.task.done" class="m-1" binary  />
            <label for="taskDoneSwitch">Done</label>
        </div>
    </div>
<!--<pre>{{props.task}}</pre>-->
</template>

<style scoped>
.task {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 0.2rem;
}

.grab {
    cursor: grab;
}



</style>