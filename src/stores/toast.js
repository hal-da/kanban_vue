import {ref} from "vue";
import {defineStore} from "pinia";

export const useToastStore = defineStore('toast', () => {
    const showToast = ref(() => {})
    const setToastFunction = (toastFunction) => {
        showToast.value = toastFunction
    }
    return { showToast, setToastFunction }
})