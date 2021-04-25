---
sidebarDepth: 2
---

# Container

Container 是一種分類模式，可能是一個資料庫、也有可能是一種雲端服務等的資料群組的載體，最主要的功用即是裝載 Model。

```ts
// 定義好 Model 結構
const profileModel = {
    body: {
        name: []
    }
}
// 將 Model 註冊進 Container
const userContainer = {
    models: {
        profile: profileModel
    }
}
// 將 Container 註冊進 Alas
const alas = new Alas({
    containers: {
        user: userContainer
    }
})
// 指定實體化 user container 的 profile model
const profile = alas.make('user', 'profile').$init({
    name: 'james'
})
console.log(profile.name) // james
```

該設計本身是很重要的部分是專案的遷移，在複數專案指向同一個 API 的時候，這些 Model 只要跟著 Container 複製到另一個專案或是託管至套件管理工具( 如 npm )，就可以建立一種隨開即用的開發模式。

### 與外部的資料交換

既然 Container 允許我們跨專案複製，意味著必須要有外部接口提供個專案的自定義環境，以下範例是假如我們必須為每位 User 注入專案所在的地區：

```ts
const profileModel = {
    body: {
        name: [],
        location: []
    },
    init(self, { name }) {
        return {
            name,
            // self.$config 指向 container config
            location: self.$config.location
        }
    }
}
const userContainer = {
    models: {
        profile: profileModel
    },
    // 在註冊 Core 之前，可以定義預設的 Config 數值
    config: {
        location: 'us'
    },
    // 在註冊進入 Core 之後就會執行 install 並獲取註冊端的 option
    install(core, config, options) {
        if (options.location) {
            config.location = options.location
        }
    }
}
const alas = new Alas({
    containers: {
        // 使用 Array 作為參數可以提供 options 給 install 的對象
        user: [userContainer, {
            location: 'tw'
        }]
    }
})
const profile = alas.make('user', 'profile').$init({
    name: 'james'
})
console.log(profile.location) // tw
```

### 指定實作對象

Interface 參數的目的是在位於這個 Container 內的 Model 必須實作那些方法，如果沒有實作，將在註冊時發出錯誤並註冊失敗：

```ts
const profileModel = {
    body: {
        name: []
    }
}
const userContainer = {
    models: {
        profile: profileModel
    },
    // 指定底下 Model 必須實作指定的參數或名稱，目前涵蓋以下四種結構
    interface: {
        body: ['name', 'age'],
        views: [],
        methods: [],
        loaders: []
    }
}
const alas = new Alas({
    containers: {
        // 這段程式碼會在執行期間擲出錯誤，因為 body 沒有 age 屬性
        user: userContainer
    }
})
```

### 共用規則與語系

在 Container 可以定義自己的驗證規則與語系，使轉移專案更加方便。

```ts
const profileModel = {
    body: {
        // 會員資料的名稱只能是英文
        name: ['onlyEnglish']
    }
}
const container = {
    models: {
        profile: profileModel
    },
    // 定義驗證規則
    rules: {
        onlyEnglish: (model, value) => {
            if (/^[a-zA-Z]+$/.test(value)) {
                return true
            } else {
                return model.$meg('onlyEnglish')
            }
        }
    },
    // 定義自有的語系
    locales: {
        'zh-tw': {
            onlyEnglish: '只能是英文'
        },
        'en-us': {
            onlyEnglish: 'Only English'
        }
    }
}
const alas = new Alas({
    containers: {
        user: userContainer
    }
})
// 顯示的語系隨著 Core 本身定義顯示
alas.setLocale('tw')
const profile = alas.make('user', 'profile').$init({
    name: '詹姆士'
})
console.log(profile.$validateBy('name')) // 只能是英文
```

```js
const containerOptions = {
    models: { ... }
}
const alas = new Alas({
    container: {
        myContainer: containerOptions
    }
})
```

## Types

```ts
import Alas, { ContainerStructure, ContainerOptions, ModelStructure } from 'alas'
type UserContainerStructure = ContainerStructure<{
    models: {
        [key: string]: ModelStructure
    }
}>

const userOptions: ContainerOptions<UserContainerStructure> = {
    models: {
        user: { ... }
    }
}

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

### models

Container 底下所有的 Model。

* type: `{ [key: string]: ModelOptions }`
* required: `false`

```js
const myModel = {
    body: {
        attr: []
    }
}
const containerOptions = {
    models: {
        myModel
    }
}
```

### config

提供給底下 Model 統一參照的物件。

* type: `{ [key: string]: any }`
* required: `false`

```js
const myModel = {
    body: {
        amount: []
    },
    views: {
        amount: self => self.amount * self.$config.exchangeRate
    }
}
const containerOptions = {
    config: {
        exchangeRate: 2
    }
}
```

### install

與外部進行資料交換的方法。

* type: `(core: Alas, config: ContainerOptionsConfig, options: any) => any`
* required: `false`

```js
const containerOptions = {
    install(core, config, options) {}
}
```

### rules

定義專屬規則。

* type: `{ [key: string]: RuleHandler }`
* required: `false`

```js
const myModel = {
    body: {
        amount: ['int']
    }
}
const containerOptions = {
    rules: {
        int(model, value) {
            return value.toString().match('.') ? '必須為整數' : true
        }
    }
}
```

### locales

定義專屬語系。

* type: `{ [key: string]: { [locale: string]: string } }`
* required: `false`

```js
const myModel = {
    body: {
        amount: ['int']
    },
    views: {
        amount: self => self.amount + self.$meg('amount')
    }
}
const containerOptions = {
    locales: {
        'en-us': {
            'amount': '金額'
        }
    }
}
```
