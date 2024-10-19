<script setup>
import {ref, watch} from "vue";
import {useCountriesStore} from "@/stores/countries.js";
const { countries } = useCountriesStore()
const selectedCountry = ref(null);
const emitter = defineEmits(['change'])
const {userCca3} = defineProps(['userCca3'])
if(!userCca3) selectedCountry.value = countries[1]
else  selectedCountry.value = countries.find(country => country.cca3 === userCca3)


watch(() => userCca3, (newVal, oldValue) => {
    selectedCountry.value = countries.find(country => country.cca3 === newVal)
})

const onCountryChange = (event) => {
    emitter('change', selectedCountry.value)
}

</script>

<template>
    <div class="card flex justify-content-center">
        <Dropdown v-model="selectedCountry"
                  :options="countries"
                  @change="onCountryChange"
                  filter :filterFields="['name.common']"
                  optionLabel="name"
                  placeholder="Select a Country"
                  class="w-full">
            <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                    <div class="mr-2 flag">{{ slotProps.value.flag }}</div>
                    <div>{{ slotProps.value.name.common }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>
            <template #option="slotProps">
                <div class="flex align-items-center">
                    <div class="mr-2 flag">{{slotProps.option.flag}}</div>
                    <div>{{ slotProps.option.name.common }}</div>
                </div>
            </template>
        </Dropdown>
    </div>
</template>

<style scoped>

</style>