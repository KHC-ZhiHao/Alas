# Package & Rule & Locale

是一種封裝驗證規則與語系的資料結構，可以獨立宣告更頂層的驗證規則與語系訊息。 

:::warning 注意
`name` 參數是唯一值，註冊在後必須透過 `#{name}.{target}` 去獲得指定的規則或是訊息，務必注意到命名的衝突。
:::

```ts
const alas = new Alas({
    packages: [
        {
            name: 'my',
            rules: {
                number(model: Model, value: any) {
                    const type = model.$utils.getType(value)
                    // 驗證結果可以透過 $meg 來返回不同的錯誤訊息
                    return type === 'number' ? true : model.$meg('#my.notNumber')
                })
            },
            locales: {
                'zh-tw': {
                    'notNumber': '不是數字'
                }
            }
        }
    ]
})

```

## Types

`PackageOptions` 是輔助你定義 package 的好幫手。

```ts
import { PackageOptions } from 'alas'
const myPackage: PackageOptions = {
    name: 'my'
}
```

## Rule

規則是一種驗證方法，將值傳給一個 function，並回傳 `true` 或是 `string`(錯誤訊息)。

```ts
function number(model: Model, value: any) {
    let type = model.$utils.getType(value)
    return type === 'number' ? true : 'Value must be a number.'
})
```
### Params

Rule 可以接受簡單的參數來賦予更靈活的宣告方法，加入參數的方法是透過 | 符號**切割**參數的鍵值，使用 : 符號**定義**指定值，例如：`max|value:20`，獲取的對象將傳遞給第二個參數。

```ts
function max(model: Model, value: any, params: { [key: string]: string }) {
    if (params.value && value > Number(params.value)) {
        return `Value more then ${params.value}.`
    }
    return true
}
```

### 所有的方法都會忽略空值

空值 ( null or undefined ) 不做驗證，可以用以下結構使空值也做檢查。

```ts
let packageOptions = {
    rules: {
        max: {
            handler: (model: Model, value) => { ... },
            required: true // 透過 required 使驗證必須不計空值
        }
    }
}
```

## Locale

身為 view model 的特性，我們必須呈現將訊息呈現給各種語言的客戶，但由於 Alas 具有封裝性，因此本身也必須要有語系的系統：

### Params

輸出的 message 允許加入動態元素，使用`{}`符號作為更動目標。

:::tip 提醒
注意 {} 不能有空格
:::

```ts
let packageOptions = {
    name: 'my',
    locales: {
        'en-us': {
            'age': '{value} years old.'
        },
        'zh-tw': {
            'age': '年齡為{value}歲'
        }
    }
}
```

### 切換語系

語系默認為 `en-us`，可以使用以下方法更換顯示狀態。

```ts
console.log(alas.meg('#my.age', { value: 20 })) // 20 years old.

// 切換成中文
alas.setLocale('zh-tw')
console.log(alas.meg('#my.age', { value: 20 })) // 年齡為20歲.

// 未定義情境下，會顯示英文
alas.setLocale('zh-cn')
console.log(alas.meg('#my.age', { value: 20 })) // 20 years old.

// 連英文也未定義情境下，回傳key值
console.log(alas.meg('#my.hw')) // #my.hw
```

### MS

MS 是一個 `MetalSheep` 官方配件包，本身已經註冊在 Core 內不需要額外引用，你可以參考[原始碼](https://github.com/KHC-ZhiHao/Alas/blob/master/core/ms-package.ts)來了解應用，而這個套件包佔據了 `ms` 關鍵名稱。

### 擴充語系

MS 本身提供了 `en-us` 與 `zh-tw` 兩個語系，你可以從以下方法訪問到該 Package 物件，可用於擴充語系：

```ts
import Alas from 'alas'
Alas.MsPackage.locales['ja'] = {
    'required': '必須'
}
```

## Container

container 本身的 model 如果要去獲取規則或是訊息是可以忽視掉前贅命名的，但如果跨 `container` 可以透過 `${containerName}.{target}` 去獲得，但我們不推薦就是了。