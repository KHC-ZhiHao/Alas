import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'search',
        component: () => import('@/views/search.vue')
    },
    {
        path: '/result',
        name: 'result',
        component: () => import('@/views/result.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
