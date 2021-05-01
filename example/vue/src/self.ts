/**
 * 這個物件只要是 vue2 專案複寫 this 用的，以此透過 self 命名紀念 this。
 */

import { app } from '@/main'
import { reactive } from 'vue'

export const self = {
    get route() {
        return app.$route
    },
    get router() {
        return app.$router
    },

    /**
     * 為了讓 TypeScript 驗證更準確，我們必須複寫 reactive 回傳的資訊。
     * @see https://khc-zhihao.github.io/Alas/guide/typescript.html#vue-%E7%9A%84%E9%9B%A3%E8%99%95
     */

    data<T>(data: T) {
        return reactive(data as any) as T
    }
}
