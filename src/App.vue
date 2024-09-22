<script setup>
import {RouterView} from 'vue-router'
import Navigation from "@/components/navigation/Navigation.vue";
import {onMounted} from "vue";
import {useToast} from "primevue/usetoast";
import {routes, url} from "@/components/utilities/constants.js";
import {useDialogStore} from "@/stores/dialog.js";
import {useToastStore} from "@/stores/toast.js";
import DialogComponent from "@/components/navigation/DialogComponent.vue";

const toastStore = useToastStore();
const toast = useToast();
const dialogStore = useDialogStore();

const showDialog = () => {
    console.log('showDialog')

    dialogStore.openDialog('title', '<b>bold? </b> <i>ital</i>', () => {
        console.log('callback')
    })
}
const show = ({severity, summary, detail, life}) => {
    const s = severity || 'info';
    const sum = summary || 'title';
    const det = detail || 'Message Content';
    const l = life || 3000;
    // toast.add({ severity, summary, detail, life });
    toast.add({severity: s, summary: sum, detail: det, life: l});
};

onMounted(async () => {
    console.log('mounted')
    const response = await fetch(url + routes.ROUTE_BOARDS)
    const boards = await response.json()
    toastStore.setToastFunction(show)
    console.log(boards)
})

</script>

<template>
    <header>
        <div>
            <nav>
                <Navigation/>
            </nav>
        </div>
    </header>
    <RouterView/>
    <DialogComponent/>
</template>

<style scoped>

</style>
