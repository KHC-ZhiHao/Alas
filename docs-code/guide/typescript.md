# TypeScript

由於 Alas 採用 TypeScrtip (以下簡稱TS) 編寫，因此擁有 TS 的完整支援，但 Model 本身由於應用模式都不一樣，所以仍然需要個別定義型態。

::: warning 注意
盡可能別使用 `addModel` 進行 Model 的新增，這對 TS 的友善度極差。
:::

## 基本宣告

```ts
import type {
    ModelOptions,
    ModelStructure,
    ContainerOptions,
    ContainerStructure
} from 'alas'

// 定義 Model 結構
type ProfileStructure = ModelStructure<{
    model: {
        name: string
        // 定義 views 必須使用 $v
        $v: Readonly<{
            name: string
        }>
    }
}>
const profileOptions: ModelOptions<ProfileStructure> = {
    body: {
        name: []
    },
    views: {
        name: self => self.name
    }
}
// 定義 Container 結構
type UserStructure = ContainerStructure<{
    models: {
        profile: ProfileStructure
    }
}>
const UserOptions: ContainerOptions<UserStructure> = {
    models: {
        profile: profileOptions
    }
}
// 定義 Core 結構
type Containers = {
    user: UserOptions
}
const alas = new Alas<Containers>({
    containers: {
        user
    }
})
```

## Container Types

Container Types 是一種快速獲取 Model 型態的方法，而不需要透過繁雜的路徑獲取類別：

```ts
import Alas, { ContainerTypes } from 'alas'

// 如上述例子...

type AlasTypes = ContainerTypes<Containers>
const alas = new Alas<Containers>({
    containers: {
        user
    }
})
function showUsername(profile: AlasTypes['user']['profile']['model']) {
    console.log(profile.name)
}
const profile = alas.make('user', 'profile').$init({ name: 'james' })
showUsername(profile) // james
```

## Vue 的難處

當我們用 Vue3 進行 reactive 獲取響應物件的時候，傳遞的資料會被轉換掛上一層 Proxy ，這將導致型態轉變使得型態驗證錯誤。

這意味著就算透過 Container Types 指定方法的參數也無法相容 reactive 中宣告的 Model :

```ts
import { reactive } from 'vue'
function showUserName(user: AlasTypes['user']['profile']['model']) {
    console.log(user.name)
}
const user = alas.make('user', 'profile')
const state = reactive({
    user
})
// 由於 user 已經被轉換型態，所以無法通過型態驗證
showUserName(state.user)
```

我們採用了一種解決方案用於複寫原本的 reactive 的型態轉換方案：

```ts
import { reactive } from 'vue'
function data<T>(data: T) {
    return reactive(data as any) as T
}
function showUserName(user: AlasTypes['user']['profile']['model']) {
    console.log(user.name)
}
const user = alas.make('user', 'profile')
const state = data({
    user
})
showUserName(state.user)
```

::: danger 警告
雖然這樣能確保資料類型相同，但必須得知 reactive 實際上是返回了一個不一樣類型的新物件，下例便是驗證的結果。
```js
import { reactive } from 'vue'
const user = {
    profile: {
        name: 'james'
    }
}
console.log(user.profile === user.profile) // true
const state = reactive({
    user
})
console.log(state.user.profile === user.profile) // false
```
:::

本章節只是敘述了一部分的宣告方式，你可以透過接下來的[結構與操作](../structure/readme.md)單元中得知如何進行其他細部操作。
