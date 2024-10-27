<script setup>
import UserImage from "@/components/auth/UserImage.vue";
import DataTableUsers from "@/components/admin/DataTableUsers.vue";
import {ref} from "vue";

defineProps({
    boards: {
        type: Array,
        required: true
    },
    parseDate: {
        type: Function,
        required: true
    },
    confirmDelete: {
        type: Function,
        required: true
    }
})
const users = ref([])


const onRowExpand = (event) => {
    console.log(event)
}

</script>

<template>
    <div class="card">
        <h2>Boards</h2>
        <DataTable
            :value="boards"
            tableStyle="min-width: 50rem"
            size="small"
            stripedRows
            v-model:expandedRows="users"
        >
            <Column expander style="width: 5rem" />

            <Column field="title" header="Name" sortable></Column>
            <!--                <Column field="email" header="Email" sortable ></Column>-->
            <Column field="createdAt" header="Created" sortable>
                <template #body="slotProps">
                    {{ parseDate(slotProps.data.createdAt) }}
                </template>
            </Column>
            <Column header="Admins">
                <template #body="slotProps">
                    {{slotProps.data.admins.length}}
                </template>
            </Column>
            <Column header="Members">
                <template #body="slotProps">
                    {{slotProps.data.members.length}}
                </template>
            </Column>
            <Column header="Delete">
                <template #body="slotProps">
                    <Button :disabled="slotProps.data.role === 'ADMIN'" text class="btn-sm" severity="danger"
                            icon="pi pi-trash" @click="confirmDelete($event, slotProps.data.id)"></Button>
                </template>
            </Column>
            <template #expansion="slotProps">
                <DataTableUsers :confirm-delete="confirmDelete" :parse-date="parseDate" :users="slotProps.data.admins" title="Admins" class="ml-4"/>
                <DataTableUsers :confirm-delete="confirmDelete" :parse-date="parseDate" :users="slotProps.data.members" title="Members" class="ml-4"/>
            </template>
        </DataTable>
    </div>
</template>

<style scoped>

</style>