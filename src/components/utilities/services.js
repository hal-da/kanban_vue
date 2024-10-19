setTimeout(() => {
},10)

// import {useAuthStore} from "@/stores/authorization.js";
import {localStorageKeys, routes, url} from "@/components/utilities/constants.js";
// const authStore = useAuthStore()

export const imageService = async (imageUrl) => {
    const token = localStorage.getItem(localStorageKeys.LS_AUTH_TOKEN)
    if (imageUrl.startsWith('https://')) {
        return imageUrl
    }
    const imageResponse = await fetch(
        url + routes.ROUTE_IMAGES + '/' + imageUrl,
        {
            method: 'GET',
            headers: {Authorization: `Bearer ${token}`}
        }
    )
    return await imageResponse.blob()
}