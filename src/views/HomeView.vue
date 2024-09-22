<script setup>
import { usePublicBoardsStore} from "@/stores/publicBoards.js";
import PublicBoard from "@/components/boards/PublicBoard.vue";
import {storeToRefs} from "pinia";
const publicBoardsStore = storeToRefs(usePublicBoardsStore())
const publicBoards = publicBoardsStore.publicBoards
console.log('homeview')
</script>

<template>
    <main class="mx-2">
        <h1 class="">Kanbantastisch</h1>
        <PublicBoard v-for="(board) in publicBoards" :board="board" />
    </main>
</template>
