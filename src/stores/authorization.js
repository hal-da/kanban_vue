import {computed, onMounted, ref} from "vue";
import {defineStore} from "pinia";
import {localStorageKeys, routes, url} from "@/components/utilities/constants.js";
import {imageService} from "@/components/utilities/services.js";

export const useAuthStore = defineStore('auth', () => {
    const authToken = ref('')
    const user = ref({})
    const userDetails = ref({})
    const userId = computed(() => user.value.id)
    const isLoggedIn = computed(() => authToken.value !== '')

    async function fetchUser() {
        const userResponse = await fetch(`${url}${routes.ROUTE_WHO_AM_I}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken.value}`,
            },
        })
        return await userResponse.json();
    }

    async function login(email, password, newImageFile) {
        try {
            const loginData = {
                email,
                password
            }
            const loginResponse = await fetch(`${url}${routes.ROUTE_LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            })
            if (loginResponse.status === 200) {
                const loginResponseJson = await loginResponse.json();

                localStorage.setItem(localStorageKeys.LS_AUTH_TOKEN, loginResponseJson.token)
                authToken.value = loginResponseJson.token
                if (newImageFile) {

                    const formData = new FormData()
                    formData.append('image', newImageFile)

                    const imageResponse = await fetch(url + routes.ROUTE_IMAGES, {
                        method: 'POST',
                        headers: {Authorization: `Bearer ${authToken.value}`},
                        body: formData
                    })

                    console.log('imageUrl in auth service', imageResponse)
                    const {imageUrl} = await imageResponse.json()

                    if (imageUrl) {
                        user.image = imageUrl
                        userDetails.image = imageUrl
                    }
                }
                user.value = await fetchUser()
                userDetails.value = await getUserDetails(user.value.id)
                return Promise.resolve({success: true, user: {...user.value}})
            }
            const reason = await loginResponse.json()
            return Promise.resolve({success: false, message: reason.error})

        } catch (e) {
            return Promise.resolve({success: false, message: e.message})
        }
    }

    async function uploadUserImage(newImageFile) {
        const formData = new FormData()
        formData.append('image', newImageFile)

        const response = await fetch(url + routes.ROUTE_IMAGES, {
            method: 'POST',
            headers: {Authorization: `Bearer ${authToken}`},
            body: formData
        })

        const {imageUrl} = await response.json()
        return await imageService(imageUrl)
    }

    onMounted(async () => {
        const token = localStorage.getItem(localStorageKeys.LS_AUTH_TOKEN)
        if (!!token) {
            const validateResponse = await fetch(`${url}${routes.ROUTE_TOKEN_VALIDATOR}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (validateResponse.status === 200) {
                authToken.value = token
                const userData = await fetchUser();
                if (userData.error) {
                    logout()
                    return
                }
                if (userData.id) {
                    userDetails.value = await getUserDetails(userData.id)
                }
                setUser(userData)
            }
        } else {
            logout()
        }
    })

    const setAuthToken = (token) => {
        authToken.value = token
    }
    const setUser = (userObj) => {
        user.value = userObj
    }
    const logout = () => {
        authToken.value = ''
        user.value = {}
        userDetails.value = {}
        localStorage.removeItem(localStorageKeys.LS_AUTH_TOKEN)
    }
    const getUserDetails = async (userId) => {
        const response = await fetch(`${url}${routes.ROUTE_USERS}/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken.value}`
            }
        })
        return await response.json()
    }

    const register = async (userName, email, password1, password2, newImageFile, cca3) => {
        try {
            const registerData = {
                email,
                password1,
                password2,
                userName,
                cca3
            }
            const registerResponse = await fetch(`${url}${routes.ROUTE_REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            })
            if (registerResponse.ok) {
                await login(email, password1)
                const formData = new FormData()
                formData.append('image', newImageFile)
                const imageResponse = await fetch(url + routes.ROUTE_IMAGES, {
                    method: 'POST',
                    headers: {Authorization: `Bearer ${authToken.value}`},
                    body: formData
                })
                console.log('imageResponse in auth service', imageResponse)
                const {imageUrl} = await imageResponse.json()
                console.log('imageUrl in auth service', imageUrl)
                if (imageUrl) {
                    user.image = imageUrl
                    userDetails.image = imageUrl
                }
                const updateObject = {
                    userName,
                    email,
                    cca3,
                    imageUrl,
                }

                console.log('updateObject', updateObject)

                const updateRes = await updateUser(updateObject)

                console.log('updateResponse after updateUser', updateRes)

                if(updateRes.success){
                    return Promise.resolve({success: true, user: {...user.value}})
                }
                console.log('updateRes', updateRes)


                return Promise.resolve({success: true})
            }
            const reason = await registerResponse.json()
            return Promise.resolve({success: false, error: reason.error})

        } catch (e) {
            return Promise.resolve({success: false, message: e.message})
        }
    }

    const updateUser = async (updateObject) => {

        try {
            const response = await fetch(`${url}${routes.ROUTE_USERS}/${userId.value}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken.value}`
                },
                body: JSON.stringify(updateObject)
            })
            if (response.ok) {
                const updatedUser = await response.json()
                userDetails.value = updatedUser
                return Promise.resolve({success: true, user: updatedUser})
            }
            const res = await response.json()
            return Promise.resolve({success: false, message:res})
        } catch (e) {
            return Promise.resolve({success: false, message: e.message})
        }


    }

    return {
        authToken,
        user,
        userDetails,
        isLoggedIn,
        userId,
        setAuthToken,
        setUser,
        logout,
        updateUser,
        login,
        register,
        getUserDetails
    }
})