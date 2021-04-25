# 什麼是 ALAS？

Alas 是一種基於 Model2 的思想所延伸的 **資源狀態管理工具**，是專注在管理後端資源送達前端過程的工具，這是一個長久 Vue 開發中的過程中反覆建立的模式整合出的套件。

在 MVC 的觀念中，我們透過封裝 Model 來向資料庫存取資料，目的就是資料能隨著商業邏輯定義接口，來防止直接操作過於底層的資料庫溝通模式，例如直接操作 SQL 語法。

<Cimg text="透過 Alas 建立前端向後端請求的媒介" src="alas-flow.png"></Cimg>

但在前後端分離的情境下，如果我們前後端非常專注在特定領域之商業邏輯的情境，那當然只需要負責呈現結果即可，可惜的是，在操作設備越來越多樣的真實世界，後端 API 越來越趨向提供相對底層的資料來讓各種裝置都能進行其對應的方式，雲端服務提供的 API 即是如此。

Alas 一開始是為了這些情境誕生的，已經有太多的資料來源在未被加工的情況下送到前端，常見的有 NoSQL、GraphQL、API 供應商的資料，如果前端開發人員不試著為這些資料建立攔截點，很容易就陷入充滿各式規則的維護惡夢。

在說明開始之前，我們先假設我們有一支正在運作的 API，情境如下:

```js
const express = require('express')
const app = express()
app.get('/users/:user', (req, res) => {
    res.json({
        name: req.params.name,
        age: 18
    })
})
app.listen(3000, () => console.log('Server running'))
```

## 如何定義 Model ?

以下例子是前端基本的 Model 建構，與 MVC 的結構類似，擁有屬性 `isAdult` 擔任了視圖呈現的部分：

```js
class User {
    constructor() {
        this.name = null
        this.age = null
    }

    get isAdult () {
        return this.age >= 18
    }

    async fetch(username) {
        let response = await axios.get(`users/${username}`)
        let user = response.data
        this.name = user.name
        this.age = user.age
    }
}
```

這樣子我們就完成 Model 的封裝了，接下來只需要在 HTML 中如下編寫程式，就能避免直接透過 [axios](https://github.com/axios/axios) 存取資料：

```html
<div id="username"></div>
<div id="age"></div>
<div id="isAdult"></div>
<script>
    let user = new User()
    user.fetch('james').then(() => {
        document.getElementById('username').innerText = '名稱:' + user.name
        document.getElementById('age').innerText = '年齡:' + user.age
        document.getElementById('isAdult').innerText = user.isAdult ? '已成年' : '未成年'
    })
</script>
```

## 在 ALAS 定義 Model

當我們使用 Class 定義 Model，很難規範出一種模式，複雜的繼承樹也容易造成專案擴展時產生阻礙，接下來我們透過 Alas 來完成上述的任務，只需定義如下：

```js
const userModel = {
    body: {
        name: [],
        age: []
    },
    views: {
        isAdult: self => self.age >= 18
    },
    loaders: {
        async fetch(self, done, fail, username) {
            try {
                let response = await axios.get(`users/${username}`)
                let user = response.data
                self.$init({
                    name: user.name,
                    age: user.age
                })
                done()
            } catch (error) {
                fail(error)
            }
        }
    }
}
```

```html
<div id="username"></div>
<div id="age"></div>
<div id="isAdult"></div>
<script>
    let alas = new Alas()
    // 將定義好的結構註冊進 Alas
    alas.addModel('user', userModel)
    // 可以將 make 是做 new 的行為
    let user = alas.make('*', 'user')
    user.$o.fetch('james').start.then(() => {
        document.getElementById('username').innerText = '名稱:' + user.name
        document.getElementById('age').innerText = '年齡:' + user.age
        document.getElementById('isAdult').innerText = user.$v.isAdult ? '已成年' : '未成年'
    })
</script>
```

到這裡，或許你已經稍微摸清 Alas 在專案中的定位了。

然而在適合 Alas 存在的專案中，並不會有上述例子如此簡單的使用情境，這些專案通常依賴著某些大型框架進行開發，而適合 Alas 生存的框架則以 Vue 最為推薦 *( Alas 本質上不需任何依賴 )*。

所以接下來的教學將會指導你如何從透過 Vue + Alas 建構一個具有良好使用者體驗的組件。
