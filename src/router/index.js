import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useAuthStore} from "@/stores/authorization.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/profile',
            name: 'profile',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/ProfileView.vue')
        },
        {
            path:'/board/:id',
            name: 'board',
            component: () => import('../views/PrivateBoard.vue'),
            props: true
        },
        {
            path:'/admin',
            name: 'admin',
            component: () => import('../views/AdminView.vue')
        }
    ]
})


router.beforeEach((to, from, next) => {
    const {isLoggedIn} = useAuthStore()

    if(to.name !== 'home' && !isLoggedIn) {
        next({name: 'home'})
    } else {
        next()
    }
})

export default router
