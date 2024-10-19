<script setup>

import {computed, ref} from "vue";
import {routes, url} from "@/components/utilities/constants.js";
import {useAuthStore} from "@/stores/authorization.js";
import {imageService} from "@/components/utilities/services.js";
import {computedAsync} from "@vueuse/core";
const {authToken} = useAuthStore()
const emit = defineEmits(['new-image'])

const {imgSrc} = defineProps({
    imgSrc: String
})



const newImageUrl = ref('')

const imgInputChangeHandler = async (e) => {

    const image = e.target.files[0]
    const imageName = image.name.replaceAll(' ', '_')
    const newFile = new File([image], imageName, { type: image.type });
    const formData = new FormData()
    formData.append('image', newFile)

    const response = await fetch(url + routes.ROUTE_IMAGES, {
        method: 'POST',
        headers: {Authorization: `Bearer ${authToken}`},
        body: formData
    })

    const {imageUrl} = await response.json()
    newImageUrl.value = URL.createObjectURL(await imageService(imageUrl))
    emit('new-image', imageUrl)
}

const imageSrcObjectUrl = computedAsync(async () => {
    if (!imgSrc) return ''
    const blob = await imageService(imgSrc)
    return URL.createObjectURL(blob);
})

</script>

<template>
    <div>
        <div v-if="!imageSrcObjectUrl && !newImageUrl" class="user-image-container" @click="$refs.newImageInput.click()">
            <i class="pi pi-user no-user-image"></i>
        </div>
        <img v-else :src="newImageUrl ? newImageUrl : imageSrcObjectUrl" alt="user image" class="user-image-container "  @click="$refs.newImageInput.click()">
        <input type="file" accept="image/*" @change="imgInputChangeHandler" ref="newImageInput" class="hidden">
    </div>
</template>

<style scoped>

.no-user-image {
    font-size: 8rem;
    color: #ccc;
}

.user-image-container {
    width: 12rem;
    height: 12rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 50%;
    margin: 0.5rem;
    cursor:pointer;
}

</style>