<script setup>
import {RouterView} from 'vue-router'
import Navigation from "@/components/navigation/Navigation.vue";
import {onMounted} from "vue";



onMounted(async () => {
    console.log('mounted')
})

</script>

<template>
    <header>
        <div>
            <nav class="">
                <Navigation/>
            </nav>
        </div>
    </header>
    <div class="xl:w-8 lg:w-10 mx-auto">

        <RouterView />
    </div>
  <Toast position="bottom-left" group="bl" />
</template>

<style scoped>

</style>
