<script setup>
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const clickHandler = () => {
  toast.add({severity: 'info', summary: 'About', detail: 'This is an about page'})
}


</script>
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Button @click="clickHandler" label="Show Toast"/>

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
