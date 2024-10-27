<script setup>

import {computed, ref} from "vue";
import {useAuthStore} from "@/stores/authorization.js";
import {storeToRefs} from "pinia";
import router from "@/router/index.js";

const authStore = useAuthStore()
const {userId} = storeToRefs(authStore)

const props = defineProps(['board'])
let divTitle = ref('Login to access board')


const userIsAllowed = computed(() => {
    let isAllowed = false
    props.board.members.forEach(member => {
        if (member.id === userId.value) {
            isAllowed = true
        }
    })
    props.board.admins.forEach(admin => {
        if (admin.id === userId.value) {
            isAllowed = true
        }
    })

    divTitle.value = isAllowed
        ? 'Click to access board'
        : 'You don\'t have access to that board. Please contact the board admin to become a member.'
    return isAllowed
})

const onBoardClickHandler = () => {
    if (userIsAllowed.value) {
        router.push({name: 'board', params: {id: props.board.id}})
    }
}

</script>

<template>
    <div @click="onBoardClickHandler" class="publicBoard p-3 md:m-2"
         :class="userIsAllowed ? 'cursorAllowed' : 'cursorNotAllowed'" :title="divTitle">
        <h2 class="m-0">{{ props.board.title }}</h2>
        <div>
<!--            <div class="text-left"><a href="#">invite me</a> </div>-->
        <div class="text-right">created by
            <a href="#" @hover.stop @click.stop title="Send private message">{{ props.board.createdBy.userName }}</a>
            @{{new Date(props.board.createdAt).toLocaleDateString("de-AT")}}
        </div>
        </div>
    </div>
</template>

<style scoped>
.publicBoard {
    border: 1px solid #ccc;
    border-radius: 5px;
}

.publicBoard {
    transition: .3s transform cubic-bezier(.155, 1.105, .295, 1.12), .3s box-shadow, .3s -webkit-transform cubic-bezier(.155, 1.105, .295, 1.12);
    cursor: pointer;
}

.cursorAllowed {
    cursor: pointer;
}

.cursorNotAllowed {
    cursor: not-allowed;
}

.publicBoard:hover {
    transform: scale(1.01);
}

</style>