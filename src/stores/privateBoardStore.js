import {ref} from "vue";
import {defineStore} from "pinia";
import {routes, url} from "@/components/utilities/constants.js";
import {useAuthStore} from "@/stores/authorization.js";

export const usePrivateBoardStore = defineStore('privateBoard', () => {
    const privateBoard = ref({})

    const fetchPrivateBoard = async (boardId) => {
        const {authToken, user} = useAuthStore()

        try {
            const response = await fetch(url + routes.ROUTE_BOARDS + `/${boardId}`,{
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            privateBoard.value = await response.json()
            privateBoard.value.userIsAdmin = userIsAdmin(user)
            privateBoard.value.columns.sort((a, b) => a.order - b.order)
            return {success: true, board: privateBoard.value}
        } catch (e) {
            return {success: false, message: e.message}

        }
    }

    const userIsAdmin = (user) => {
        let isAdmin = false
        privateBoard.value.admins.forEach(admin => {
            if (admin.id === user.id) {
                isAdmin = true
            }
        })
        return isAdmin
    }

    const resetBoard = () => {
        privateBoard.value = {}
    }

    const refreshBoard = async () => {
        return await fetchPrivateBoard(privateBoard.value.id)
    }

    return { privateBoard, fetchPrivateBoard, resetBoard, refreshBoard }
})