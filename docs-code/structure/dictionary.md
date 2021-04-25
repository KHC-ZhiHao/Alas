---
sidebarDepth: 2
---

# Dictionary

Dictionary 是 Model 的 Key: Value 型態，相關參數定義再 Model Options 的 dictionary 屬性。

```js
const options = {
    body: {
        age: []
    }
    dictionary: {
        views: {
            avgAge: self => {
                let total = 0
                self.map.forEach(model => {
                    total += model.age
                })
                return total / self.size
            }
        }
    }
}

alas.addModel('user', options)
const users = alas.makeDictionary('*', 'user')
users.write({
    james: {
        age: 10
    },
    dave: {
        age: 20
    }
})
console.log(users.v.avgAge) // 15
```

## Types

Dictionary 的結構跟 Model 的方法很類似，只需要宣告在 dictionary 的 Structure 上：

```ts
import { ModelStructure, ModelOptions, Loader } from 'alas'

type ProfileStructure = ModelStructure<{
    model: {
        name: string
        age: number
    }
    dictionary: {
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
    dictionary: {
        views: {
            ages: self => {
                let output = []
                self.map.forEach(m => output.push(m.age))
                return output
            }
        },
        methods: {
            addAge: (self, age) => self.map.forEach(m => {
                m.age += age
            })
        },
        loaders: {
            async fetch(self, done, fail) {
                try {
                    let items = await fetchUsers()
                    self.write(items)
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

### views

回傳經過計算的結果。

* type: `{ [key: string]: any }`
* required: `false`

```ts
const options = {
    body: {
        age: []
    },
    dictionary: {
        views: {
            totalAge: self => {
                let result = 0
                self.map.forEach(model => {
                    result += model.age
                })
                return result
            }
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
    dictionary: {
        methods: {
            addAll(self, value) {
                self.map.forEach(model => {
                    model.count += value
                })
            }
        }
    }
}
```

### loaders

基於 Dictionary 的加載管理系統。

* type: `{ [key: string]: Loader }`
* required: `false`

```ts
const options = {
    body: {
        name: []
    },
    dictionary: {
        loaders: {
            async fetch(dictionary, done, fail) {
                let items = await ajax('getUsers')
                dictionary.write(items)
                done()
            }
        }
    }
}
```

## Property

### map

Model 的實值載體，本體是 Map 物件。

* type: `Map`

### size

Dictionary 的長度。

* type: `number`

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
dictionary.setDirty = function(status: boolean = true) => void
```

### on

監聽一個事件。

```ts
dictionary.on = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### once

監聽一個事件，但觸發一次即結束。

```ts
dictionary.once = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### off

關閉指定 Id 的監聽對象。

```ts
dictionary.off = function(eventName: string, listenerId: string) => void
```

### emit

發送一則事件。

```ts
dictionary.emit = function(eventName: string, ...params?: Array<any>) => void
```

### isChange

Dictionary 的屬性是否有被更動過，例如長度或是身為 ref 時初始化的資料。

```ts
dictionary.isChange = function() => boolean
```

### validate


觸發 Dictionary 內部所有 Model 的 `$validate` 並回傳 result。

```ts
dictionary.validate = function() => {
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

宣告所有 Dictionary 內部的 Model 執行 `$body()` 並回傳物件結構。

```ts
dictionary.bodys = function() => {
    [key: string]: any
}
```

### exports

宣告所有 Dictionary 內部的 Model 執行 `$export()` 並回傳物件結構。

```ts
dictionary.exports = function() => {
    [key: string]: any
}
```

### has

指定 key 對象有無存在。

```ts
dictionary.has = function(key: string) => Boolean
```

### get

獲取指定 key 對象。

```ts
dictionary.get = function(key: string) => Model || null
```

### write

寫入 Model。

```ts
dictionary.write = function(source: { [key: string]: Object }) => void
```

### remove

移除指定 key 對象。

```ts
dictionary.remove = function(key: string) => void
```

### clear

清除所有資料。

```ts
dictionary.clear = function() => void
```
