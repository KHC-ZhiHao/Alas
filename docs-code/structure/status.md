---
sidebarDepth: 2
---

# Status

```ts
const alas = new Alas()
const status = alas.registerStatus('myFirstStatus', {
    states: {
        user: () => {
            return {
                name: 'james',
                age: 18
            }
        }
    },
    loaders: {
        async fetchUser(self, done, fail, { username }) {
            let user = await getUser(username)
            self.fetch('user').$init(user)
            done()
        }
    }
})
```

## Types

Status 本身就有 Type 的隱式處理，但 Loader 本身定義較為困難，以下是定義 Status Loader 的範例：

```ts
import { LoaderDone } from 'alas'
const status = alas.registerStatus('myFirstStatus', {
    states: {},
    loaders: {
        // 使用 LoaderDone 確定回傳值必須是數字
        async fetch(self, done: LoaderDone<number>, fail, { username }: { username: string }) {
            let user = await getUser(username)
            self.fetch('user').$init(user)
            done(1)
        }
    }
})
```

## Property

### loaders

獲取 Status 定義的加載方法。

* type: `{ [key: loaders]: Loader }`

## Methods

### on

監聽一個事件。

```ts
status.on = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### once

監聽一個事件，但觸發一次即結束。

```ts
status.once = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### off

關閉指定 Id 的監聽對象。

```ts
status.off = function(eventName: string, listenerId: string) => void
```

### set

設定一個狀態為指定的值。

```ts
status.set = function(stateName: string, value: { [key: string]: any }) => void
```

### fetch

獲取指定狀態。

```ts
status.fetch = function(stateName: string) => Object
```

### reset

重置指定狀態。

```ts
status.reset = function(stateName: string) => void
```

### resetAll

重置所有狀態。

```ts
status.resetAll = function() => void
```

## Events

::: tip 提示
Status Event是屬於系統單方面發送，不存在 emit 方法。
:::

### set

使用 `set` 時被觸發。

```ts
status.on('set', (statue: Status, context: { id: string }, data: { name: string, value: any }) => { ... })
```

### reset

使用 `reset`、`resetAll` 時被觸發。

```ts
status.on('reset', (statue: Status, context: { id: string }, data: { name: string }) => { ... })
```

### fetch

使用 `fetch` 時被觸發。

```ts
status.on('fetch', (statue: Status, context: { id: string }, data: { name: string, result: any }) => { ... })
```
