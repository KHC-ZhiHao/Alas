---
sidebarDepth: 2
---

# Core

所有的 Model 都是以物件的型態存在，必須透過 Alas Core 的魔法才能賦予 Model 生命。

```ts
const alas = new Alas({
    // 用於辨識用的命名
    name: 'my first alas core',
    // 註冊 Container，相關文件可直接參照後續的 Container 章節
    containers: { /* Containers */ },
    // 註冊 Package，相關文件可直接參照後續的 Packages 章節
    packages: [ /* Packages */ ]
})
```

## Types

實體化 Alas 的過程中可以透過泛型的第一個參數引入 Containers，此後所有經由 Alas 的物件皆會綁定 TS 型態。

```ts
import Alas, { ContainerStructure } from 'alas'
type Containers = {
    [key: string]: ContainerStructure
}
const alas = new Alas<Containers>({ ... })
```

## Static

### utils

方便開發用的工具組，可以參考 [Utils](./utils) 章節。

* type: `Utils`

### Model

Model Constructor，提供給需要進行擴展的開發人員使用。

* type: `Model` 

### List

List Constructor，提供給需要進行擴展的開發人員使用。

* type: `List` 

### Dictionary

Dictionary Constructor，提供給需要進行擴展的開發人員使用。

* type: `Dictionary` 

### MsPackage

預設包 Ms Package 的物件，可以藉由拓展此物件來增加 Ms Package 的語系支援範圍。

* type: `PackageOptions`

由於是純物件，這裡提供一組擴展思路：

```js
import Alas from 'alas'
Alas.MsPackage.locales['ja'] = {
    'number': '数'
}
```

## Property

### name

Core 的名稱。

* type: `string`

### utils

方便開發用的工具組，可以參考 [Utils](./utils) 章節。

* type: `Utils`

## Methods

### addModel

在 Global Container 註冊一個 Model，透過這支 API，Model 會被統一註冊進入一個 `*` Container。

```ts
alas.addModel = function(modelName: string, options: ModelOptions) => void
```

* options: [`ModelOptions`](./model.md)

::: warning 警告
不建議使用，主要是為了展示時使用的方法。
:::

::: details Example
```ts
alas.addModel('user', {
    body: {
        name: []
    }
})
const user = alas.make('*', 'user')
```
:::

### addContainer

註冊 Container。

```ts
alas.addContainer = function(name: string, options: ContainerOptions) => void
```

* options: [`ContainerOptions`](./container.md)

::: warning 警告
不建議使用，請在實體化透過 Constructor 註冊，以提升 TS 的準確性。
:::

### addPackage

註冊 Package。

```ts
alas.addPackage = function(options: PackageOptions) => void
```

* options: [`PackageOptions`](/docs/operational/package.md)

::: warning 警告
不建議使用，請在實體化透過 Packages 註冊，以提升 TS 的準確性。
:::

### make

實體化 Model。

```ts
alas.make = function(containerName: string, modelName: string, options?: { save?: boolean }) => Model
```

### makeList

建立指定的 Model List。

```ts
alas.makeList = function(containerName: string, modelName: string, options?: { save?: boolean }) => List
```

### makeDictionary

建立指定的 Model Dictionary。

```ts
alas.makeDictionary = function(containerName: string,, modelName: string,, options?: { save?: boolean }) => Dictionary
```

### setLocale

設定整個系統呈現的語系，預設為 `en-us`。

```ts
alas.setLocale = function(locale: string) => void
```

### meg

顯示預設好的訊息，訊息會隨著現在定義的語系呈現。

```ts
alas.meg = function(key: string, params?: { [key: string]: any }) => string
```

### registerStatus

建立一個託管多個物件的 Status。

```ts
alas.registerStatus = function(name: string, options: StatusOptions) => Status
```

* options: [`StatusOptions`](./status.md)

::: details Example
```ts
const status = alas.registerStatus('my-status', {
    states: {
        user: () => alas.make('*', 'user')
    },
    loaders: {
        async fetchUser(status, done, fail, { username }) {
            try {
                let { data } = await axios.get(`users/${username}`)
                status.fetch('user').$init(data)
                done()
            } catch (error) {
                fail(error)
            }
        }
    }
})
```
:::

### instanceof

檢查物件是否來自指定 Model，只要來源相同，不論是 List 或是 Dictionary 皆會回傳 `true`。

```ts
alas.instanceof = function(containerName: string, modelName: string, data: any) => Boolean
```

::: details Example
```ts
const status = alas.registerStatus('my-status', {
    states: {
        user: () => alas.make('*', 'user')
    },
    loaders: {
        async fetchUser(status, done, fail, { username }) {
            try {
                let { data } = await axios.get(`users/${username}`)
                status.fetch('user').$init(data)
                done()
            } catch (error) {
                fail(error)
            }
        }
    }
})
```
:::

### rules

回傳驗證的方法組合，便於使用某些自定義的驗證規則。

```ts
alas.rules = function(rules: string[]) => Array<Function>
```

::: details Example
```ts
let verifyNumber = (data) => {
    let rules = alas.rules(['#ms.required', '#ms.number'])
    for (let rule of rules) {
        let result = rule(data)
        if (result !== true) {
            return false
        }
    }
    return true
}
console.log(verifyNumber(1)) // true
```
:::

### on

監聽一個事件。

```ts
alas.on = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### once

監聽一個事件，但觸發一次即結束。

```ts
alas.once = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### off

```ts
alas.off = function(eventName: string, listenerId: string) => void
```

## Events

::: tip 提示
Core Event是屬於系統單方面發送，不存在 emit 方法。
:::

### makedModel

建立 model 可以被獲取到。

```ts
alas.on('makedModel', (alas: Core, context: { id: string }, model: Model) => { ... })
```

### makedList

剛剛建立出來的 list 可以被獲取到。

```ts
alas.on('makedList', (alas: Core, context: { id: string }, list: List) => { ... })
```

### makedDictionary

剛剛建立出來的 dictionary 可以被獲取到。

```ts
alas.on('makedDictionary', (alas: Core, context: { id: string }, dictionary: Dictionary) => { ... })
```

### registeredStatus

剛剛建立出來的 status 可以被獲取到。

```ts
alas.on('registeredStatus', (alas: Core, context: { id: string }, status: Status) => { ... })
```
