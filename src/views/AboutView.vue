<script setup>
import {useToastStore} from "@/stores/toast.js";
const toastStore = useToastStore();


</script>
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Button @click="toastStore.showToast({severity: 'info', summary: 'About', detail: 'This is an about page'})" label="Show Toast"/>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
