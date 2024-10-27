<script setup>
import { usePublicBoardsStore} from "@/stores/publicBoards.js";
import { usePublicUserStore} from "@/stores/publicUserStore.js";
import PublicBoard from "@/components/boards/PublicBoard.vue";
import {storeToRefs} from "pinia";
import {useCountriesStore} from "@/stores/countries.js";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useAuthStore} from "@/stores/authorization.js";

usePublicUserStore()
useCountriesStore()
useAuthStore()
const publicBoardsStore = storeToRefs(usePublicBoardsStore())
const authStore = useAuthStore()
const publicBoards = publicBoardsStore.publicBoards
const publicBoardsCopy = ref(publicBoards.value)
const filter = reactive({
    title: '',
    createdByMe: false,
    memberOf: false,
    adminOf: false
})

const sortChoiceSelected = ref('')
const sortChoiceSelectedBefore = ref('')

const sortChoices =[
    {label: 'Title', value: 'title', icon: 'pi pi-arrow-down'},
    {label: 'Created at', value: 'createdAt', icon: 'pi pi-arrow-down'},
    {label: 'Created by', value: 'createdBy', icon: 'pi pi-arrow-down'},
]

const userHasNoMouse= computed(() => {
    return window.matchMedia("(any-hover: none)").matches
})

const applyFilter = () => {
    console.log('applyFilter', sortChoiceSelected.value.value)
    const filtered = publicBoards.value.filter(board => {
        return board.title.includes(filter.title) &&
            (filter.createdByMe ? board.createdBy.id === authStore.user.id : true) &&
            (filter.memberOf ? board.members.some(member => member.id === authStore.user.id) : true) &&
            (filter.adminOf ? board.admins.some(admin => admin.id === authStore.user.id) : true)
    })

    let sorted = filtered.sort((a,b)=> Date.parse(a.createdAt) - Date.parse(b.createdAt))

    sorted = sorted.sort((a, b) => {
        if (sortChoiceSelected.value.value === 'title') {
            return a.title.localeCompare(b.title)
        } else if (sortChoiceSelected.value.value === 'createdBy') {
            return b.createdBy.id.localeCompare(a.createdBy.id)
        }
    })
    if(sortChoiceSelectedBefore.value === sortChoiceSelected.value.value){
        filtered.reverse()
    }

    publicBoardsCopy.value = sorted
    sortChoiceSelectedBefore.value = sortChoiceSelected.value.value === sortChoiceSelectedBefore.value ? '' : sortChoiceSelected.value.value
}

onMounted(() => {
    applyFilter()
})

watch(publicBoards, () => {
    applyFilter()
})


</script>

<template>
    <main class="mx-2">
        <h1 class="">Kanbantastisch</h1>
        <Accordion :class="[userHasNoMouse ? '': 'mx-2 ']">
            <AccordionTab  class="my-0 pt-0">
                <template #header>
                    <h3 class="my-0">Sort & Filter</h3>
                </template>
                <div class="flex-column p-0 ">
                    <div class="pt-2">
                        <Dropdown v-model="sortChoiceSelected" :options="sortChoices" optionLabel="label"
                                   @change="applyFilter"
                                  placeholder="Sort" class="w-full">
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <i :class="sortChoiceSelectedBefore === slotProps.option.value ? 'pi pi-arrow-up' : slotProps.option.icon" class="mr-2"></i>
                                    <span>{{slotProps.option.label}} </span>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                    <h3>Filter</h3>
                    <div class="pt-2">
                        <FloatLabel>
                            <InputText id="title" v-model="filter.title" class="w-full" @input="applyFilter" />
                            <label for="title">title</label>
                        </FloatLabel>
                    </div>
                    <div class="pt-2">
                        <Checkbox v-model="filter.createdByMe" @change="applyFilter" inputId="createdByMe" name="createdByMe" :binary="true"/>
                        <label for="createdByMe" class="ml-2"> createdByMe </label>
                    </div>
                    <div  class="pt-2">
                        <Checkbox v-model="filter.memberOf" @change="applyFilter" inputId="memberOf" name="memberOf" :binary="true" />
                        <label for="memberOf" class="ml-2"> memberOf </label>
                    </div>
                    <div  class="pt-2">
                        <Checkbox v-model="filter.adminOf" @change="applyFilter" inputId="adminOf" name="adminOf" :binary="true" />
                        <label for="adminOf" class="ml-2"> adminOf </label>
                    </div>
                </div>
            </AccordionTab>
        </Accordion>
        <PublicBoard v-for="(board, i) in publicBoardsCopy" :board="board" :key="i" :class="[userHasNoMouse?'my-2':'']"/>
    </main>
</template>

<style>
.p-accordion-content{
    padding-top: 0 !important;
}
</style>