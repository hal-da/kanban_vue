<script setup>
import { usePublicUserStore} from "@/stores/publicUserStore.js";
import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";

const publicUserStore = usePublicUserStore()

const {publicUsers, publicUsersName} = storeToRefs(publicUserStore)
const emit = defineEmits(['change'])
const {title, users} = defineProps({
    users: {
        type: Array,
        default: () => []
    },
    title: {
        value: 'Members' | 'Admins',
        required: true
    },
})

const value = ref([...users.map(user => user.userName)]);
const items = ref([]);

const search = (event) => {
    items.value = [...publicUsers.value.map(user => user.userName).filter(userName => userName.toLowerCase().includes(event.query.toLowerCase()))]
}

const addClickHandler = (event) => {
    users.value = []
    // for every username in value, find public user object and add to users
    value.value.forEach(userName => {
        const user = publicUsers.value.find(user => user.userName === userName)
        users.value.push(user)
    })
    emit('change', [...users.value])
}
</script>

<template>

    <div class="flex-column flex-grow-1">
        <FloatLabel class="flex-grow-1 w-full">
            <AutoComplete v-model="value" id="useers" forceSelection multiple :suggestions="items" @complete="search"
                          class="py-0 flex-grow-1 w-full" @change="addClickHandler"/>
            <label for="users" class="flex-grow-1">Type to search for {{ title }}</label>
        </FloatLabel>
    </div>
</template>

<style scoped>
.p-autocomplete {
    display: block;
}
</style>