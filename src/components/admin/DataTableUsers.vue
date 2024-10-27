<script setup>

import UserImage from "@/components/auth/UserImage.vue";

defineProps({
    users:{
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
    },
    title: {
        type: String,
        required: true
    }
})


</script>

<template>
    <div class="card">
        <h2>{{ title }}</h2>
        <DataTable :value="users " tableStyle="min-width: 50rem" size="small" stripedRows>
            <Column header="image">
                <template #body="slotProps">
                    <UserImage :img-src="slotProps.data.imageUrl" :active="false" />
                </template>
            </Column>
            <Column field="userName" header="Name" sortable ></Column>
            <Column field="email" header="Email" sortable ></Column>
            <Column field="createdAt" header="Member since" sortable >
                <template #body="slotProps">
                    {{ parseDate(slotProps.data.createdAt) }}
                </template>
            </Column>
            <Column header="Delete">
                <template #body="slotProps">
                    <Button :disabled="slotProps.data.role === 'ADMIN'" text class="btn-sm" severity="danger"  icon="pi pi-trash" @click="confirmDelete($event, slotProps.data.id)"></Button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>

</style>