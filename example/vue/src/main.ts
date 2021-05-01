import '@/style.css'

import { createApp, reactive } from 'vue'
import Alas from 'alas'

import App from './app.vue'
import alas from './alas'
import router from './router'
import components from './components'

export const vue = createApp(App)

vue.use(router)
vue.use(components)
vue.use(Alas.Vue3Plugin, { reactive, alas })

export const app = vue.mount('#app')
