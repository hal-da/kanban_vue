<script setup>
import { ref, watch} from "vue";
import Auth from "@/components/auth/Auth.vue";
import {useRoute} from "vue-router";
import {usePrivateBoardStore} from "@/stores/privateBoardStore.js";
import {useAuthStore} from "@/stores/authorization.js";
import UserImage from "@/components/auth/UserImage.vue";
import {usePublicBoardsStore} from "@/stores/publicBoards.js";
import {usePublicUserStore} from "@/stores/publicUserStore.js";
const privateBoardStore = usePrivateBoardStore()
const publicBoardsStore = usePublicBoardsStore()
const publicUserStore = usePublicUserStore()
const authStore = useAuthStore()
const route = useRoute();
const items = ref([
    {label: 'Home', icon: 'pi pi-home', route: '/'},
    {label: 'Profile', icon: 'pi pi-star', route: '/profile'}
])

watch(route,async (newRoute) => {
    await publicBoardsStore.fetchPublicBoards()
    await publicUserStore.fetchPublicUsers()
    if (!newRoute.params.id) {
        privateBoardStore.resetBoard()
    }
})


</script>

<template>
    <div class="card">
        <Menubar :model="items" class="py-0">
            <template #start >
                <UserImage :img-src="authStore.userDetails.imageUrl" :active="false" class="userImage"/>
            </template>
            <template #item="{ item, props, hasSubmenu }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                        <span :class="item.icon"/>
                        <span class="ml-2">{{ item.label }}</span>
                    </a>
                </router-link>
            </template>
            <template #end>
                <Auth/>
            </template>
        </Menubar>
    </div>
</template>

<style scoped>

</style>