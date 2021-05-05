---
sidebarDepth: 2
---

# List

List 是 Model 的陣列型態，相關參數定義再 Model Options 的 list 屬性。

```js
const options = {
    body: {
        name: []
    }
    list: {
        views: {
            names: self => self.items.map(e => e.name)
        }
    }
}
alas.addModel('user', options)
const users = alas.makeList('*', 'user')
users.batchWrite([
    {
        name: 'james'
    },
    {
        name: 'dave'
    }
])
console.log(users.v.names) // ['james', 'dave']
```

## Types

List 的結構跟 Model 的方法很類似，只需要宣告在 list 的 Structure 上：

```ts
import { ModelStructure, ModelOptions, Loader } from 'alas'

type ProfileStructure = ModelStructure<{
    model: {
        name: string
        age: number
    }
    list: {
        // 透過 v 定義 views
        v: Readonly<{
            ages: number[]
        }>
        // 透過 m 定義 methods
        m: Readonly<{
            addAge: (age: number) => void
        }>
        // 透過 o 定義 loader
        o: Readonly<{
            fetch: Loader<void, void>
        }>
    }
}>
const profileOptions: ModelOptions<ProfileStructure> = {
    list: {
        views: {
            ages: self => self.items.map(m => m.age)
        },
        methods: {
            addAge: (self, age) => self.forEach(m => {
                m.age += age
            })
        },
        loaders: {
            async fetch(self, done, fail) {
                try {
                    let items = await fetchUsers()
                    self.batchWrite(items)
                    done()
                } catch (error) {
                    fail(error)
                }
            }
        }
    }
}
```

## Options

### key

指定唯一 key 鍵，如果在 list 內的 model 有相同的 key 則複寫，如果沒有設定此選項則不會有取代問題。

* type: `(model) => string`
* required: `false`

```js
const options = {
    body: {
        id: []
    },
    list: {
        key: model => model.id
    }
}
```

### write

自訂 `$write` 寫入物件時是否能夠通過或執行某些狀況。

* type: `(list, context) => void`
* required: `false`

```ts
type Context = {
    key: string
    model: Model
    reject: (error: string) => void
    success: () => void
}
const options = {
    body: {
        name: []
    },
    list: {
        write(self, context: Context) {
            if (context.model.name == null) {
                context.reject('Name not found.')
            } else {
                context.success()
            }
        }
    }
}
```

### writeAfter

當物件寫入**成功**後執行。

* type: `(list, context) => void`
* required: `false`

```ts
type Context = {
    key: string
    model: Model
}
const options = {
    body: {
        name: []
    },
    list: {
        writeAfter(self, context: Context) {
            // do something ...
        }
    }
}
```

### views

回傳經過計算的結果。

* type: `{ [key: string]: any }`
* required: `false`

```ts
const options = {
    body: {
        name: []
    },
    list: {
        views: {
            names: self => self.items.map(e => e.name)
        }
    }
}
```

### methods

專屬的方法，用途不一但可廣泛使用。

* type: `{ [key: string]: (...params: any) => any }`
* required: `false`

```ts
const options = {
    body: {
        count: []
    },
    list: {
        methods: {
            addAll(self, value) {
                self.forEach(model => {
                    model.count += value
                })
            }
        }
    }
}
```

### loaders

基於 List 的加載管理系統。

* type: `{ [key: string]: Loader }`
* required: `false`

```ts
const options = {
    body: {
        name: []
    },
    list: {
        loaders: {
            async fetch(list, done, fail) {
                let items = await ajax('getUsers')
                list.batchWrite(items)
                done()
            }
        }
    }
}
```

## Property

### size

List 的長度。

* type: `number`

### items

實質裝載的陣列。

* type: `array`

::: warning 警告
可以藉由 item 進行一些迭代的行為，但盡可能別透過 items 進行刪除、插入等行為。
:::

### dirty

是否有被執行過寫入的行為，就算長度為 0 也算。

* type: `boolean`

### v

獲取 [views](#views) 計算過的唯讀屬性。

* type: `{ [key: views]: any }`

### m

獲取 [methods](#methods) 定義的泛用方法。

* type: `{ [key: methods]: any }`

### o

獲取 [loaders](#loaders) 定義的加載方法。

* type: `{ [key: loaders]: Loader }`

### loader

更頂級的狀態管理。

* type: `LoaderCase`

### config

獲取所屬 Container 的 [config](./container.md#config)。

* type: `{ [key: string]: any }`

### utils

返回 [Utils](../operational/utils.md) 工具。

* type: `Utils`

### parent

是否是被參照對象或是在 List、Dictionary 之中。

* type: `Model | List | Dictionary`

::: warning 警告
由於對象不一定務必小心操作。
:::

## Methods

### setDirty

可以直接調整 [dirty](#dirty) 的狀態。

```ts
list.setDirty = function(status: boolean = true) => void
```

### on

監聽一個事件。

```ts
list.on = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### once

監聽一個事件，但觸發一次即結束。

```ts
list.once = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### off

關閉指定 Id 的監聽對象。

```ts
list.off = function(eventName: string, listenerId: string) => void
```

### emit

發送一則事件。

```ts
list.emit = function(eventName: string, ...params?: Array<any>) => void
```

### forEach

```ts
list.forEach = function (callback: (model: Model, index: number) => any) => null
```

**callback 中回傳 _break 即可中斷整個迭代：**

```ts
list.forEach(model => {
    return '_break'
})
```

### isChange

List 的屬性是否有被更動過，例如長度或是身為 ref 時初始化的資料。

```ts
list.isChange = function() => boolean
```

### validate

觸發 List 內部所有 Model 的 `$validate` 並回傳 result。

```ts
list.validate = function() => {
    success: boolean,
    result: Array<{
        result: {
            [key: string]: any
        }
        success: boolean
    }>
}
```

### bodys

宣告所有內部的 Model 執行 `$body()` 並回傳。

```ts
list.bodys = function() => Array<Object>
```

### exports

宣告所有內部的 Model 執行 `$export()` 並回傳陣列結構。

```ts
list.exports = function() => Array<Object>
```

### has

指定 key 對象有無存在。

```ts
list.has = function(key: string) => boolean
```

### fetch

獲取指定 key 對象。

```ts
list.has = function(key: string) => Model | null
```

### write

寫入一筆資料。

```ts
list.write = function(source: Object | Model, options?: { insert?: number }) => void
```

* options.insert: `數據的插入點`

### batchWrite

寫入多筆資料。

```ts
list.batchWrite = function(items: Array<Object | Model>) => void
```

### batchWriteAsync

由於 List 本身寫入一筆資料相較最基礎的陣列來說是需要付出高額性能代價的，因此可以藉由非同步寫入來緩解系統的負擔。

```ts
list.batchWriteAsync = function(items: Array<Object | Model>,  ms: number = 2, parallel: number = 1) => Prmise<undefined>
```

* `ms`: 每毫秒進行一次寫入。
* `parallel`: 一次寫入數量。

### remove

移除指定 key 的對象。

```ts
list.remove = function(key: string) => void
```

### removeByItem

移除指定的 Model。

```ts
list.removeByItem = function(item: Model) => void
```

### clear

清空所有資料。

```ts
list.clear = function() => void
```

## Events

### $writeSuccess

寫入資料成功後觸發此事件。

```ts
type Data = {
    key: string
    model: Model
    source: Model | Object
};
list.on('$writeSuccess', (list: List, context: { id: string }, data: Data) => { ... })
```

### $writeReject

寫入資料失敗後觸發此事件。

```ts
type Data = {
    key: string
    model: Model
    source: Model | Object
    message: any
};
list.on('$writeReject', (list: List, context: { id: string }, data: Data) => { ... })
```

### $writeAsyncDone

透過 [batchwriteasync](#batchwriteasync) 寫入資料完畢後觸發此事件。

```ts
list.on('$writeAsyncDone', (list: List, context: { id: string }) => { ... })
```

### $fetch

使用 [fetch](#fetch) 並有獲取到資料後觸發。

```ts
list.on('$fetch', (list: List, context: { id: string }, model: Model) => { ... })
```

### $fetchFail

使用 [fetch](#fetch) 並沒有獲取到資料後觸發。

```ts
list.on('$fetchFail', (list: List, context: { id: string }, key: string) => { ... })
```

### $remove

觸發 [remove](#remove) 或 [removeByItem](#removebyitem) 後觸發。

```ts
list.on('$remove', (list: List, context: { id: string }, key: string) => { ... })
```

### $clear

觸發 [clear](#clear) 後觸發。

```ts
list.on('$clear', (list: List, context: { id: string }, key: string) => { ... })
```
