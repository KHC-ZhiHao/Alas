# 安裝

## 安裝

Webpack or ES6 module:

```bash
npm install --save alas
```

```js
import Alas from 'alas'
let alas = new Alas()
```

## 支援環境

* 建議使用支援 Proxy 的現代瀏覽器。
* Typescript 4+
* Node 10+

## 註冊 Vue

雖然 Alas 不需要任何外部依賴就可以運行，但要融合進 Vue 的系統就必須透過 Vue Plugin 的註冊過程才能完整具有 **雙向響應** 的能力。

#### Vue2

```js
import Alas from 'alas'
import Vue from 'vue'

const alas = new Alas()

Vue.use(Alas.Vue2Plugin, { alas })
```

#### Vue3

```js
import Alas from 'alas'
import { createApp, reactive } from 'vue'

const alas = new Alas()
const vue = createApp({ ... })

vue.use(Alas.Vue3Plugin, { alas, reactive })
```
