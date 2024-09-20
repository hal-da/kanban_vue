<script setup>

import {ref} from "vue";

const props = defineProps(['board'])
const {board} = ref(props)
</script>

<template>
<pre>{{props.board}}</pre>
</template>

<style scoped>

</style>