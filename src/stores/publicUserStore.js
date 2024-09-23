import {defineStore} from "pinia";
import {onMounted, ref} from "vue";
import {routes, url} from "@/components/utilities/constants.js";

export const usePublicUserStore = defineStore('publicUser', () => {
    const publicUsers = ref([])
    const publicUsersName = ref([])

    const fetchPublicUsers = async () => {
        try {
            const response = await fetch(url +  routes.ROUTE_USERS)
            publicUsers.value = await response.json()
            return {success: true, users: publicUsers.value}
        } catch (e) {
            return {success: false, message: e.message}
        }
    }

    onMounted(async () => {
        console.log('fetching users on mount')
        const allUsers = await fetchPublicUsers()
        publicUsersName.value = allUsers.users.map(user => user.username)
        console.log(allUsers)
    })



    return { publicUsers, fetchPublicUsers, publicUsersName }
})