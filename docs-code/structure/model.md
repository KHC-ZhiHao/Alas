---
sidebarDepth: 2
---

# Model

Model 負責定義了資料的模樣，接下來的例子會開始說明 Model 的各種組合模式。

## Types

```ts
import Alas, { ContainerStructure, ContainerOptions, ModelStructure, ModelOptions, Loader } from 'alas'

// 定義 Attr Model

type AttrStructure = ModelStructure<{
    model: {
        age: number
    }
}>

const attrOptions: ModelOptions<AttrStructure> = {
    body: {
        age: []
    }
}

// 定義 Profile Model

type ProfileStructure = ModelStructure<{
    model: {
        name: string
        attr: AttrStructure['model']
        // 透過 $v 定義 views
        $v: Readonly<{
            age: number
        }>
        // 透過 $m 定義 methods
        $m: Readonly<{
            setAge: (age: number) => void
        }>
        // 透過 $o 定義 loader
        $o: Readonly<{
            fetch: Loader<void, {
                username: string
            }>
        }>
        // 透過 $init 控制 init 的物件型態
        $init: (params: { username: string }) => Structure['model']
    }
}>

const profileOptions: ModelOptions<ProfileStructure> = {
    body: {
        name: []
    },
    refs: {
        attr: 'attr'
    },
    init(self, { username }) {
        return {
            name: username
        }
    },
    views: {
        age: self => self.attr.age
    },
    methods: {
        setAge(self, age) {
            self.attr.age = age
        }
    },
    loaders: {
        async fetch(self, done, fail, { username }) {
            try {
                let data = await fetchUser(username)
                self.$init(data)
                done()
            } catch (error) {
                fail(error)
            }
        }
    }
}

// 將 Model 引入 Container

type UserContainerStructure = ContainerStructure<{
    models: {
        attr: AttrStructure
        profile: ProfileStructure
    }
}>

const userOptions: ContainerOptions<UserContainerStructure> = {
    models: {
        attr: attrOptions,
        profile: profileOptions
    }
}

// 將 Container 引入 Alas

type Containers = {
    user: UserContainerStructure
}

const alas = new Alas<Containers>({
    containers: {
        user: userOptions
    }
})
```

## Options

### body

定義 Model 的最基礎的屬性與其規則，建議由 String、Boolean、Number 等平面類型所組成，例如一個人的名稱與年齡。

* type: `{ [key: string]: Array<string> }`
* required: `false`

```js
const options = {
    body: {
        name: ['#ms.type|is:string'],
        age: ['#ms.type|is:number']
    }
}
```

::: danger 警告
別宣告 Body 擁有 Function、Model 等屬性，原因在實體化 Model 時會執行 JSON 的序列化，因此過度複雜的方法會導致程式上的錯誤。
:::

### defs

`$init` 執行後如果為 `null`、`undefined` 則使用相對應的 key 回傳的數值取代。

```js
const options = {
    body: {
        name: ['#ms.type|is:string']
    },
    defs: {
        name: self => 'no name'
    }
}
```

### refs

定義某個屬性為相同 Container 底下的 Model、List、Dictionary。

* type: `{ [key: string]: string }`
* required: `false`

```js
const options = {
    refs: {
        user: 'user'
    }
}
```

只要將目標包裹`[]`就會轉換成 List，`{}`則為 Dictionary ：

```js
let user = {
    refs: {
       lAttributes: '[attributes]',
       dAttributes: '{attributes}'
    }
}

// ...

console.log(user.lattributes.size) // 0
```

### init

複寫原有的 `$init` 規則，初始規則是直接映射 key 的數值，而複寫可以使其擁有轉換不同鍵值的能力。

```js
const options = {
    body: {
        name: ['#ms.type|is:string']
    },
    init(self, source = {}) {
        return {
            name: source.Name
        }
    }
}
```

### inited

觸發 `$init` 後再執行。

```js
const options = {
    inited(self) {}
}
```

### export

複寫原有的 `$export` 規則，初始規則是直接映射 key 的數值，而複寫可以使其擁有轉換不同鍵值的能力。

```js
const options = {
    body: {
        name: ['#ms.type|is:string']
    },
    export(self) {
        return {
            Name: self.name
        }
    }
}
```

### views

回傳經過計算的結果。

```js
const options = {
    body: {
        name: ['#ms.type|is:string']
    },
    views: {
        name: self => self.name || '未命名'
    }
}
```

### defaultView

觸發的時機為 views key 沒被宣告或者是 view 對象返回值為 `null` or `undefined`。


```js
const options = {
    body: {
        name: ['#ms.type|is:string']
    },
    views: {
        name: self => self.name || 'no name'
    },
    defaultView(self, key) {
        return `${key} 未設定`
    }
}
```

### methods

專屬的方法，用途不一但可廣泛使用。

```js
const options = {
    body: {
        name: ['#ms.type|is:string']
    },
    methods: {
        setName(self, name) {
            self.name = name
        }
    }
}
```

### loaders

基於 async 與加載狀態的管理模式。

```js
const options = {
    loaders: {
        async fetch(self, done, fail, params) {
            try {
                let data = await getUser(params.username)
                self.$init(data)
                done()
            } catch (error) {
                fail(error)
            }
        }
    }
}
```

### self

self 並不是傳統的 private 屬性，而是規格外的屬性，在 self 定義的結構並沒有規則，執行的條件是在 `$init` 之後觸發：

```js
const options = {
    // source 與 init 的對象是同一個
    self(self, source = {}) {
        return {
            name: source.Name
        }
    }
}
```

### errorMessage

回傳錯誤訊息的方法。

```js
const options = {
    errorMessage(self, error) {
        return error ? error.meg || null
    }
}
```

### watch

可以在**改變數值**前觸發指定的方法。

:::tip 注意
由於只限於附值時觸發，所以如果修改對象是多層級物件內的屬性時不會起作用。
:::

```js
const options = {
    body: {
        name: ['#ms.type|is:string']
    },
    watch: {
        name(self, value) {
            console.log('old name', self.name)
            console.log('new name', value)
        }
    }
}
```

### list

基於陣列結構的 Model，詳情可見 [List](./list.md) 章節。

### dictionary

基於 Key:Value 結構的 Model，詳情可見 [Dictionary](./dictionary.md) 章節。

## Property

### $v

獲取 [views](#views) 計算過的唯讀屬性。

* type: `{ [key: views]: any }`

### $m

獲取 [methods](#methods) 定義的泛用方法。

* type: `{ [key: methods]: any }`

### $o

獲取 [loaders](#loaders) 定義的加載方法。

* type: `{ [key: loaders]: Loader }`

### $loader

更頂級的狀態管理。

* type: `LoaderCase`

### $config

獲取所屬 Container 的 [config](./container.md#config)。

* type: `{ [key: string]: any }`

### $utils

返回 [Utils](../operational/utils.md) 工具。

* type: `Utils`

### $ready

是否執行過 `$init`。

* type: `boolean`

### $error

是否執行過 `$setError`， 如果執行過回傳 [errorMessage](#errormessage) 的結果。

* type: `any`

### $parent

是否是被參照對象或是在 List、Dictionary 之中。

* type: `Model | List | Dictionary`

::: warning 警告
由於對象不一定務必小心操作。
:::

## Methods

### $on

監聽一個事件。

```ts
model.$on = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### $once

監聽一個事件，但觸發一次即結束。

```ts
model.$once = function(eventName: string, callback: EventCallback) => string
```

* return: `listener id`

### $off

關閉指定 Id 的監聽對象。

```ts
model.$off = function(eventName: string, listenerId: string) => void
```

### $emit

發送一則事件。

```ts
model.$emit = function(eventName: string, ...params: any[]) => void
```

### $raw

返回現在存取的原始資料。

```ts
model.$raw = function() => any
```

### $meg

返回現在 alas 指定的語系文字訊息。

```ts
model.$meg = function(key: string, value?: { [key: string]: any }) => string
```

### $init

初始化 Model。

```ts
model.$init = function(data: any) => Model // 返回自己
```

### $copy

複製一份與當下狀態相同的 Model。

```ts
model.$copy = function(options?: { save?: boolean }) => Model
```

### $body

複製並回傳當下 [body](#body) 的狀態。

```ts
model.$body = function() => { [key: string]: any }
```

### $setAttr

批次更新常數屬性，意指更新屬性為 `number` | `string` | `boolean` | `null` | `undefined`  的值。

```ts
model.$setAttr = function(data: { [key: string]: any }) => void
```

### $keys

回傳 [body](#body) 與 [refs](#refs) 的 key 值。

```ts
model.$keys = function() => string[]
```

### $reset

屬性資料回朔成宣告 `$init` 後或最後執行 `$commit` 的狀態。

```ts
model.$reset = function(key?: string) => void
```

* key: 指定 key 重置，如沒指定則全部重置。

### $rules

回傳指定屬性驗證的方法組。

```ts
model.$rules = function(name: string) => Array<(value: any) => true | string>
```

### $commit

把 cache 資料轉換成現在的資料，將影響 `$isChange`、`$reset` 兩種方法的結果。

```ts
model.$commit = function() => void
```

### $profile

將 Model 轉換並回傳成可視化的資料，由於 Model 是無法轉換成 JSON 的循環結構，因此可以使用本方法轉換成單純的物件，這是給予開發人員方便開發的功能。

```ts
model.$profile = function() => Object
```

### $export

回傳執行 [export](#export) 的結果。

```ts
model.$export = function() => any
```

### $reload

重新替換 model 底層的所有資料，初始化所有 body 和 refs 的資料並再次觸發 init，重新呼叫 created 行為並發送 event。

::: warning 警告
通常不建議使用 reload 來重置資料，但有時 ref 的對象需要重新賦予數值，請謹慎使用。
:::

```ts
model.$reload = function() => void
```

### $isChange

當前數值是否與宣告 `$init` 時相同。

> 該方法在 options.save 宣告為 false 時無效。

```ts
model.$isChange = function(key?: string) => boolean
```

* key: 指定某個屬性是否改變，如果省略則驗證全部。

### $validate

驗證目前 model 的數值是否符合 body 定義的規則。

```ts
model.$validate = function() => {
    success: boolean,
    result: {
        // 如果是屬性回傳驗證錯誤字串
        [key]: string | true,
        // 如果是 Ref 對象回傳 Validate 物件
        [key]: {
            success: boolean,
            result: object
        }
    }
}
```

### $generate

返回一個全新的 model，可以視為 `core.make(thisModelContainer, thisModelName)`。

```ts
model.$generate = function(options?: { save?: boolean }) => Model
```

### $generateFrom

可以建立同一個 container 的 model、list、dictionary。

```ts
model.$generateFrom = function(target: string, options?: { save?: boolean }) => any
```

**example**

```ts
let model = model.$generateFrom('user')
let list = model.$generateFrom('[user]')
let dictionary = model.$generateFrom('{user}')
```

### $validateBy

驗證指定參數是否符合 body 定義的規則。

```ts
model.$validateBy = function(key: string) => true || string
```

### $setError

設定 Model 的錯誤狀態。

```ts
model.$setError = function(error: any) => void
```

## Events

### $error

執行 `$setError` 後觸發。

```ts
model.on('$error', (model: Model, context: { id: string }, error: any) => { ... })
```

### $ready

執行 `$init` 後觸發。

```ts
model.on('$ready', (model: Model, context: { id: string }) => { ... })
```
