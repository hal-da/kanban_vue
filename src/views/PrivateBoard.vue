<script setup>
import {onMounted,  ref} from "vue";
import {usePrivateBoardStore} from "@/stores/privateBoardStore.js";
import {storeToRefs} from "pinia";

const props = defineProps({
    id: String
})

const privateAuthStore = usePrivateBoardStore()
const {privateBoard} = storeToRefs(privateAuthStore)
console.log(privateBoard)

onMounted(async () => {
    const res = await usePrivateBoardStore().fetchPrivateBoard(props.id)
    if(!res.success){
        console.log(res)
        console.log('error fetching private board')
    }
})


</script>

<template>
    <h2 class="text-center">{{privateBoard.title}}</h2>
    <div class="boardBody flex">
        <Column v-for="column in privateBoard.columns" :column="column" :key="column.id"/>
    </div>
</template>

<style scoped>
.boardBody {
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    height: calc(100vh - 150px);
    overflow: auto;
}
</style>