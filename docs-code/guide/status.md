# 搞定 Vue 資源狀態

如果說真的與現有的 Vue 架構相比有大幅改善的地方，莫過於是狀態管理了，本章節將展示為什麼不要將後端資源給 Vuex 進行託付的原因，以及如何透過 Alas 改善。

<Cimg text="ALAS 不是要取代上述的狀態管理模式，而是分擔所有狀態都塞進 Vuex 的問題。" src="vue-state-map.png"></Cimg>

## Vuex

如果你覺得 Model 要定義的東西太多了，那就來看看 Vuex 要承擔 Alas 是什麼樣子，以下例子是需求從單一 Component 轉移到共享狀態時，在沒有 Model 的時候是如何透過 Vuex 完成的：

```js
// store.js
import axios from 'axios'
import { createStore } from 'vuex'
export default createStore({
    state: {
        user: null,
        error: null,
        called: false,
        loading: false
    },
    actions: {
        async fetch({ context }, username) {
            commit('startFetch')
            try {
                let { data } = await axios.get(`/users/${username}`)
                commit('finishFetch', data)
            } catch(error) {
                commit('errorFetch', error)
            }
        }
    },
    mutations: {
        startFetch(state) {
            state.called = true
            state.loading = true
        },
        finishFetch(state, user) {
            state.user = user
            state.loading = false
        },
        errorFetch(state, error) {
            state.error = error
            state.loading = false
        },
        clear(state) {
            state.user = null
            state.error = null
            state.called = false
            state.loading = false
        }
    },
    modules: {
        user: state => state.user,
        error: state => state.error,
        called: state => state.called,
        loading: state => state.loading,
        isAdult: state => state.user ? state.user.age >= 18 : null
    }
})
```

```vue
<template>
    <div>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error: {{ error }}</div>
        <div v-else>
            <div>Name: {{ user.name }}</div>
            <div>Age: {{ user.age }}</div>
            <div>{{ isAdult ? '已成年' : '未成年' }}</div>
            <button type="button" @click="refresh">Refresh</button>
        </div>
    </div>
</template>
<script>
import { useStore } from 'vuex'
import { defineComponent, onMounted, reactive } from 'vue'
export default defineComponent({
    props: {
        username: String
    },
    setup({ username }) {
        const store = useStore()
        onMounted(() => {
            if (store.getters['called']) {
                store.dispatch('fetch', username)
            }
        })
        const refresh = () => {
            store.commit('clear')
            store.dispatch('fetch', username)
        }
        return {
            refresh,
            user: computed(() => store.getters['user']),
            error: computed(() => store.getters['error']),
            isAdult: computed(() => store.getters['isAdult']),
            loading: computed(() => store.getters['loading'])
        }
    }
})
</script>
```

Vuex 在處理 **動作同步行為(interaction)** 是良好的 *(這也是 ALAS 不擅長的地方)*，例如進行拖曳、跳出訊息之類等 Layout Component 就很適合與 Vuex 進行封裝處理，但當目標放在向後端請求資源的時候缺點就會暴露出來。

* TypeScript 支援度很差
* 一個行為要變更的程式碼實在太多
* 當需求變更的時候，Vuex 容易造成其他程式碼一同發生錯誤
* 當規模大時，由於 Vuex 的職責過多，基於屬性 modules 進行擴展的管理並不容易，容易造成開發者的混亂
* 當對 UX 有嚴格的要求的時候，Vuex 會有大量需要特別定義的 state，這將導致過度偶合的問題發生

## Alas Status

ALAS 自己具有建立 Model Group 的功能，稱之為 `Status`，以下例子將解釋如何取代 Vuex 管理後端資源的角色：

```js
// root-status.js
import { alas } from '@/alas'
export const rootStatus = alas.registerStatus('RootStatus', {
    states: {
        user: () => alas.make('*', 'user')
    }
})
```

```vue
<template>
    <div>
        <div v-if="user.$o.fetch.loading">Loading...</div>
        <div v-else-if="user.$o.fetch.error">Error: {{ user.$o.fetch.error }}</div>
        <div v-else>
            <div>Name: {{ user.$v.name }}</div>
            <div>Age: {{ user.$v.age }}</div>
            <div>{{ state.user.$v.isAdult ? '已成年' : '未成年' }}</div>
            <button type="button" @click="refresh">Refresh</button>
        </div>
    </div>
</template>
<script>
import { rootStatus } from './root-status.js'
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
    props: {
        username: String
    },
    setup({ username }) {
        const user = rootStatus.fetch('user')
        onMounted(() => {
            if (user.$o.fetch.called === false) {
                user.$o.fetch.start(username)
            }
        })
        const refresh = () => {
            rootStatus.reset('user')
            user.$o.fetch.start(username)
        }
        return {
            user,
            refresh
        }
    }
})
</script>
```

在定義好 Model 後基於狀態的延伸變得非常簡單：

* 狀態可以重置
* TypeScript 的支援佳，變動相對容易
* 可以基於 Import 行為去引入 Status，使管理更加容易
* 複合式的狀態由 Model 本身去接手，改善了 Vuex 本身要進行資料改動的困難
