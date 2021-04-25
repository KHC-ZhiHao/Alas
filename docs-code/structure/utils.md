---
sidebarDepth: 2
---

# Utils

我們提供了一些簡易的方法協助優化程式碼。

## Static

### isModel

指定對象是否為 Model。

```ts
utils.isModel = function(target: any) => boolean
```

### isList

指定對象是否為 List。

```ts
utils.isList = function(target: any) => boolean
```

### isDictionary

指定對象是否為 Dictionary。

```ts
utils.isDictionary = function(target: any) => boolean
```

### jpjs

執行 `JSON.parse(JSON.stringify(obj))`，一個 JavaScript 歷久不衰的數值拷貝方法。

```ts
utils.jpjs = function(data: any) => any
```

### getType

獲取類型，能獲取比 `typeof` 更多的屬性。

```ts
utils.getType = function(data: any) => string
```

除了底下這些例子外，其他皆回傳 `typeof` 的值

```ts
utils.getType([]) // array
utils.getType(NaN) // NaN
utils.getType(null) // empty
utils.getType(undefined) // empty
utils.getType(/test/) // regexp
utils.getType(new Promise(() => {})) // promise
utils.getType(Buffer.from('123')) // buffer
utils.getType(new Error()) // error
```

### verify

驗證並回傳包含預設值的新結果， Allow Types 的項目請參照 [getType](#gettype)。

```ts
type Verify = {
    // [required, allow types, default value]
    [key: string]: [boolean, string[], any?]
};
utils.verify = function(data: Object, verify: Verify) => { [key: string]: any }
```

example

```ts
let options = {
    a: 5,
    b: [],
    e: 10
}
let data = utils.verify(options, {
    a: [true, ['number']],
    b: [true, ['array']],
    c: [false, ['number'], 0]
})
console.log(data.a) // 5
console.log(data.c) // 0
// 當 key 未宣告目標時則回傳原數值。
console.log(data.e) // 10
```

### generateId

產生一組仿 uuid 的隨機字串。

```ts
utils.generateId = function() => string
```

### peel

可以獲得指定的路徑對象的值，找不到則回傳 undefined，相關邏輯可以參照[可選鍊](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining)。

```ts
utils.peel = function(target: Object, path: string, default?: any) => any || undefined
```

example

```ts
let a = {
    b: {
        c: {
            d: 5
        }
    }
}
console.log(utils.peel(a, 'b.c.d')) // 5
```

### mapping

指定 Key By Key 的轉換。

:::tip 提醒
當遇到的對象為 Model 、 List 、 Dictionary 時都會回傳 `export` 的值。
:::

```ts
type Base = {
    [key: string]: any
};
utils.mapping = function(keyMap: { [key: string]: string }, target: Base, reverse?: boolean) => Base
```

example

```ts
const keyMap = {
     a: 'A',
     b: 'B'
}
const target = {
     A: 5,
     B: 3
}
const output = utils.mapping(keyMap, target)
console.log(output.a) // 5
console.log(output.b) // 3
```

### valueTo

建立一個對應第一個參數的 Key 物件，但值為指定對象。

```ts
type Base = {
    [key: string]: any
};
utils.valueTo = function(target: Base, value: (key: string) => any) => Base
```

example

```ts
const target = {
    a: 5
}
const output = utils.valueTo(target, () => 10)
console.log(target.a) // 5
console.log(output.a) // 10
```
