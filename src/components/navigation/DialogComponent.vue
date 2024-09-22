<script setup>
import {useDialogStore} from "@/stores/dialog.js";
import {storeToRefs} from "pinia";

const dialogStore = storeToRefs(useDialogStore())
const visible = dialogStore.dialogVisible
const title = dialogStore.dialogTitle
const content = dialogStore.dialogContent

</script>

<template>
    <Dialog v-model:visible="visible" modal :header="title" :style="{ width: '50vw' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <p class="m-0" v-html="content">
        </p>
    </Dialog>
</template>

<style scoped>

</style>