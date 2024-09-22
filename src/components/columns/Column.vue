<script setup>
import { usePrivateBoardStore} from "@/stores/privateBoardStore.js";
import {storeToRefs} from "pinia";
const privateBoardStore = usePrivateBoardStore()
const {privateBoard} = storeToRefs(privateBoardStore)
const props = defineProps(['column'])


</script>

<template>
    <div class="column m-1">
        <div class="flex">
            <h3 class="px-2">{{props.column.title}}</h3>
            <Button v-if="privateBoard?.userIsAdmin"  text class="ml-auto my-auto"><i class="pi pi-cog "/></Button>
        </div>
        <Divider class="mt-0"/>
        <pre>{{props.column}}</pre>
    </div>
</template>

<style scoped>
.column {
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    height: calc(100vh - 200px);
}

</style>