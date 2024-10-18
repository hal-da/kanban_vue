import {BANANENREPUBLIK, COUNTRIES_API, ERDBEERLAND, localStorageKeys} from "@/components/utilities/constants.js";
import {onMounted, ref} from "vue";
import {defineStore} from "pinia";


export const useCountriesStore = defineStore('countries', () => {
    const countries = ref([])

    const fetchCountries = async () => {
        const countriesFromLocalStorage = localStorage.getItem(localStorageKeys.LS_COUNTRIES)
        if(countriesFromLocalStorage) {
            const {countries:c, ts} = JSON.parse(countriesFromLocalStorage)
            console.log('countries from local storage', c)
            const now = Date.now()
            // if the countries were fetched less than 30 days ago, use them
            if(now - ts < 1000 * 60 * 60 * 24 * 30) {
                countries.value = c
                console.log('countries from local storage', countries.value)
                return
            }
        }
        const response = await fetch(COUNTRIES_API)
        const unsortedCountries = await response.json()
        countries.value = unsortedCountries.sort((a, b) => a.name.common > b.name.common ? 1 : -1)
        countries.value.unshift(BANANENREPUBLIK)
        countries.value.unshift(ERDBEERLAND)
        const autIndex = countries.value.findIndex(country => country.cca3 === 'AUT')
        const aut = countries.value.splice(autIndex, 1)
        countries.value.unshift(aut[0])
        localStorage.setItem(localStorageKeys.LS_COUNTRIES, JSON.stringify({countries: countries.value, ts: Date.now()}))
    }

    onMounted(async () => {
        await fetchCountries()
    })

    return {countries, fetchCountries}
})