# 融入 Vue 專案

Aals 是這是一個長久 Vue 開發中的過程中反覆建立的模式整合出的套件，在本章中將逐步解釋為何建議要在 Vue 專案中建構 Model。

::: tip 提示
接下來所有的案例都會從 Vue3 的角度出發，雖然 Alas 也支援 Vue2，但由於 Alas 建議使用 TypeScript，因此可以考慮使用 [vue-composition-api](https://github.com/vuejs/composition-api) 作為你的 Vue2 專案首選。
:::

## 對於請求模式的變動

未引入 Model 架構下，我們要顯示會員資料，最簡單的前後端串接的模式如下：

```vue
<template>
    <div>
        <div v-if="state.loading">Loading...</div>
        <div v-else-if="state.error">Error: {{ state.error }}</div>
        <div v-else>
            <div>Name: {{ state.user.name }}</div>
            <div>Age: {{ state.user.age }}</div>
            <div>{{ isAdult ? '已成年' : '未成年' }}</div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import { defineComponent, onMounted, reactive, computed } from 'vue'
export default defineComponent({
    props: {
        username: String
    },
    setup({ username }) {
        const state = reactive({
            user: null,
            error: null,
            loading: false
        })
        const isAdult = computed(() => {
            if (state.user) {
                return state.user.age >= 18
            }
            return null
        })
        onMounted(async() => {
            state.loading = true
            try {
                state.user = (await axios.get(`users/${username}`)).data
            } catch(error) {
                state.error = error
            }
            state.loading = false
        })
        return {
            state,
            isAdult
        }
    }
})
</script>
```

我們可以看到上述例子在專案擴大後有什麼缺點：

* user 的結構不明，通常需要透過模擬或是文件才能得知。
* state 過於肥大，如果有多個請求需要建立很多 error、loading 狀態。
* 資料與視圖處理過於耦合，這也是 Vue 專案重構時最常見的阻礙。

## 改由 Alas 實現上述功能

```js
// alas.js
import Alas from 'alas'
import axios from 'axios'
export const alas = new Alas()

alas.addModel('user', {
    body: {
        name: ['#ms.required'],
        age: ['#ms.required', '#ms.number']
    },
    views: {
        name: self => self.name,
        age: self => self.age,
        isAdult: self => self.age >= 18
    },
    loaders: {
        async fetch(self, done, fail, username) {
            try {
                let { data } = await axios.get(`/users/${username}`)
                self.$init(data)
                done()
            } catch (error) {
                fail(error)
            }
        }
    }
})
```

```vue
<template>
    <div>
        <div v-if="state.user.$o.fetch.loading">Loading...</div>
        <div v-else-if="state.user.$o.fetch.error">Error: {{ state.user.$o.fetch.error }}</div>
        <div v-else>
            <div>Name: {{ state.user.$v.name }}</div>
            <div>Age: {{ state.user.$v.age }}</div>
            <div>{{ state.user.$v.isAdult ? '已成年' : '未成年' }}</div>
        </div>
    </div>
</template>
<script>
import { alas } from './alas.js'
import { defineComponent, onMounted, reactive } from 'vue'
export default defineComponent({
    props: {
        username: String
    },
    setup({ username }) {
        const state = reactive({
            user: alas.make('*', 'user')
        })
        onMounted(() => {
            state.user.$o.fetch.start(username)
        })
        return {
            state
        }
    }
})
</script>
```

雖然這下子需要建立更多的檔案，但將大量編寫在 Vue File 的邏輯抽離了出來，讓 Component 只需專注在顯示畫面與客戶的互動事件上可帶來不少的好處：

* 關於 user 的資料結構清晰可見
* 所有的請求都有獨立狀態，不需要額外建立
* 有利於我們閱讀該檔案
* 新需求加入後有更多的改變空間
* 提升了程式碼的利用率
* 對重構更加友善

## ES6 module 管理檔案

Alas 的出發點即是 ES6 module，我們提供一種檔案管理模式最佳化你的專案開發，當然這不是一種信條，你隨時可以依照情境改變你的結構：

```bash
├── app.vue
├── views
|   └── home.vue
└── alas
    ├── index.js # core
    ├── package.js
    └── containers
        └── user
            ├── index.js # container
            ├── profile.js # model
            └── attributes.js # model
```
