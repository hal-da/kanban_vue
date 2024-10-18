<script setup>
import { usePublicBoardsStore} from "@/stores/publicBoards.js";
import { usePublicUserStore} from "@/stores/publicUserStore.js";
import PublicBoard from "@/components/boards/PublicBoard.vue";
import {storeToRefs} from "pinia";
import {useCountriesStore} from "@/stores/countries.js";

usePublicUserStore()
useCountriesStore()
const publicBoardsStore = storeToRefs(usePublicBoardsStore())
const publicBoards = publicBoardsStore.publicBoards
</script>

<template>
    <main class="mx-2">
        <h1 class="">Kanbantastisch</h1>
        <PublicBoard v-for="(board, i) in publicBoards" :board="board" :key="i" />
    </main>
</template>
