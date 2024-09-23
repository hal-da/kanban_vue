<script setup>
import { usePublicBoardsStore} from "@/stores/publicBoards.js";
import { usePublicUserStore} from "@/stores/publicUserStore.js";
import PublicBoard from "@/components/boards/PublicBoard.vue";
import {storeToRefs} from "pinia";

const publicUserStore = usePublicUserStore()
const publicBoardsStore = storeToRefs(usePublicBoardsStore())
const publicBoards = publicBoardsStore.publicBoards
publicUserStore.fetchPublicUsers()
console.log('homeview')
</script>

<template>
    <main class="mx-2">
        <h1 class="">Kanbantastisch</h1>
        <PublicBoard v-for="(board, i) in publicBoards" :board="board" :key="i" />
    </main>
</template>
