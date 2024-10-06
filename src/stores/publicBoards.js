import {defineStore} from "pinia";
import {onMounted, ref} from "vue";
import {routes as constants, url} from "@/components/utilities/constants.js";

export const usePublicBoardsStore = defineStore('publicBoards', () => {
    let publicBoards = ref([])
    const fetchPublicBoards = async () => {
        try {
            const apiBoardsUrl = url + constants.ROUTE_BOARDS
            const response = await fetch(apiBoardsUrl)
            publicBoards.value = await response.json()
        } catch (e) {
            console.log(e)
            publicBoards.value = []
        }
    }
    onMounted(async ()  => {
        await fetchPublicBoards()
    })

    return { publicBoards, fetchPublicBoards }
})