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
            <nav>
                <Navigation/>
            </nav>
        </div>
    </header>
    <RouterView/>
  <Toast position="top-left" group="tl" />
  <Toast position="bottom-left" group="bl" />
  <Toast position="bottom-right" group="br" />

</template>

<style scoped>

</style>
