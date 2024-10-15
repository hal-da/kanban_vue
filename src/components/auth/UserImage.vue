<script setup>

import {reactive} from "vue";

const props = defineProps({
    imgSrc: String
})
const {imgSrc} = reactive({
    imgSrc: ''
})

const imgInputChangeHandler = (e) => {
    console.log('img input change')
    console.log(e)
    console.log(e.target.files[0])
}


</script>

<template>

    <img :src="imgSrc" alt="user image"  >
    <input type="file" accept="image/*"  @change="imgInputChangeHandler">



</template>

<style scoped>

</style>