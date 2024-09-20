import {defineStore} from "pinia";
import {ref} from "vue";

export const useDialogStore = defineStore('dialog', () => {
  const dialogVisible = ref(false)
  const dialogTitle = ref('')
  const dialogContent = ref('')
  const dialogActions = ref([])

  const openDialog = (title, content, actions) => {
    dialogVisible.value = true
    dialogTitle.value = title
    dialogContent.value = content
    dialogActions.value = actions
  }

  const closeDialog = () => {
    dialogVisible.value = false
  }

  return { dialogVisible, dialogTitle, dialogContent, dialogActions, openDialog, closeDialog }
})