<script setup>
import { usePrivateBoardStore} from "@/stores/privateBoardStore.js";
import {storeToRefs} from "pinia";
import Task from "@/components/tasks/Task.vue";
const privateBoardStore = usePrivateBoardStore()
const {privateBoard} = storeToRefs(privateBoardStore)
const props = defineProps(['column'])


</script>

<template>
    <div class="column m-1">
        <div class="flex">
            <h3 class="pl-2">{{props.column.title}} </h3>
            <div class="ml-auto py-2 mr-2">
                <span class="pr-0" style="font-size:small">Limit: {{props.column.wipLimit}}</span>
                <i v-if="privateBoard?.userIsAdmin" class="pi pi-cog ml-2 editBoard text-primary-600"/>
            </div>

        </div>
        <Divider class="mt-0"/>
        <Task v-for="task in props.column.tasks" :task="task" :key="task.id"/>
<!--        <pre>{{props.column}}</pre>-->
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

</style>