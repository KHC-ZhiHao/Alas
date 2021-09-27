---
sidebarDepth: 2
---

# Loader

Loader 是伴隨著發送非同步請求時，產生相對應畫面而生的功能。

<Cimg text="Loader 是注重非同步執行模式" src="loader.png"></Cimg>

## Types

* type: `Loader<Response, Params>`

```ts
import { Alas, Loader } from 'alas'
import { ModelStructure, ModelOptions, Loader } from 'alas'

type UserStructure = ModelStructure<{
    model: {
        $o: {
            // 必須透過 done 回傳 number, 並接受 username 參數
            fetch: Loader<number, {
                username: string
            }>
        }
    }
}>
const userOptions: ModelOptions<UserStructure> = {
    loaders: {
        async fetch(self, done, fail, { username }) {
            try {
                let userId = await fetchUser(username) // retrun Promise<number>
                done(userId)
            } catch (error) {
                fail(error)
            }
        },
        // 可以藉由 loaderSimplify 省略掉 callback 行為，效力等同上面方法
        fetchSimple: Alas.loaderSimplify(async (self, { username }) => {
            let userId = await fetchUser(username)
            return userId
        })
    }
}
// make user ...
user.$o.fetch.start({ username: '123' }).then(result => console.log(typeof result)) // number
```

## Property

### called

是否執行過 `start` 或是 `seek`。

* type: `boolean`

### done

是否已經在執行過程中呼叫過 `done`。

* type: `boolean`

### error

是否已經在執行過程中呼叫過 `fail`，如果呼叫過該值則為錯誤訊息。

* type: `any` | `null`

### loading

執行過程中是否已經執行 `done` 或 `fail`，如果都沒有則為 `true`，如果尚未執行 `start` 或是 `seek` 則為 `false`。

* type: `boolean`

### message

是否有透過 [setMessage](#setmessage) 給予指定訊息。

* type: `string`

### result

執行 `done` 的結果。

* type: `any` | `null`

## Methods

### setMessage

設置這此 loader 的訊息。

```ts
loader.setMessage = function(message: string) => void
```

### on

監聽一個事件。

```ts
loader.on = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### once

監聽一個事件，但觸發一次即結束。

```ts
loader.once = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### off

關閉指定 Id 的監聽對象。

```ts
loader.off = function(eventName: string, listenerId: string) => void
```

### start

執行 handle。

```ts
loader.start = function(data: any) => Promise<any>
```

### seek

執行 handle。，如果已經執行過則直接回傳結果，如果正在執行中就等待該次執行執行完畢。

```ts
loader.seek = function(data: any) => Promise<any>
```

### reset

將 loading、called、error 等所有狀態回到最初始的型態。

```ts
loader.reset = function() => void
```

## Events

### setMessage

執行 `setMessage` 後觸發此事件。

```ts
list.on('setMessage', (loader: Loader, context: { id: string }, message: string) => { ... })
```

### success

當 Handler 執行成功後觸發此事件。

```ts
list.on('success', (loader: Loader, context: { id: string }, result: any) => { ... })
```

### error

當 Handler 執行失敗後觸發此事件。

```ts
list.on('error', (loader: Loader, context: { id: string }, error: any) => { ... })
```

### start

當 Handler 執行後觸發此事件。

```ts
list.on('start', (loader: Loader, context: { id: string }) => { ... })
```

## Extended

Loader 本身是一個泛用性極高的物件，也可以透過靜態方法建立一組跳脫 Model 的 Simplify Loader，範例如下：

```ts
import { Alas } from 'alas'

const myLoader = Alas.generateSimplifyLoader(async(context, params: {
 username: string
}) => {
    let userId = await fetchUser(params.username)
    return userId
})

myLoader.start({ username: 'dave' }).then(e => { ... })
console.log(myLoader.called) // true
```
