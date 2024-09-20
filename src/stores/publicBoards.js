import {defineStore} from "pinia";
import {onMounted, ref} from "vue";
import {routes as constants, url} from "@/components/utilities/constants.js";

export const usePublicBoardsStore = defineStore('publicBoards', () => {
    let publicBoards = ref([])
    const fetchPublicBoards = async () => {
        try {
            const response = await fetch(url + constants.ROUTE_BOARDS )
            publicBoards.value = await response.json()
        } catch (e) {
            console.log(e)
        }
    }
    onMounted(async ()  => {
        await fetchPublicBoards()
    })

    return { publicBoards, fetchPublicBoards }
})