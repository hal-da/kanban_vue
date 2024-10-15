import {computed, onMounted, ref} from "vue";
import {defineStore} from "pinia";
import {localStorageKeys, routes, url} from "@/components/utilities/constants.js";

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

    async function login(email, password) {
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

    onMounted(async () => {
        const token = localStorage.getItem('kanbantastischAuthToken')
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
                if(userData.error) {
                    logout()
                    return
                }
                console.log(userData)
                if (userData.id) {
                    console.log('fetching user details')
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
        localStorage.removeItem(localStorageKeys.LS_AUTH_TOKEN)
    }
    const getUserDetails = async (userId) => {
        console.log('fetching user details in getUserDetails', userId)
        const response = await fetch(`${url}${routes.ROUTE_USERS}/${userId}/details`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken.value}`
            }
        })
        const userDetailsResponse = await response.json()
        console.log('user details response', userDetailsResponse)
        return userDetailsResponse
    }

    const register = async (userName, email, password1, password2) => {
        try {
            const registerData = {
                email,
                password1,
                password2,
                userName,

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

                return Promise.resolve({success: true})
            }
            const reason = await registerResponse.json()
            return Promise.resolve({success: false, error:reason.error})

        } catch (e) {
            return Promise.resolve({success: false, message: e.message})
        }
    }

    return {authToken, user, userDetails, isLoggedIn, setAuthToken, setUser, logout, fetchUser, login, userId, register, getUserDetails}
})