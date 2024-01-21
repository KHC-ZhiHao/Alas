<br>

<p align="center"><img style="max-width: 300px" src="./logo.png"></p>

<h1 align="center">ALAS</h1>
<h3 align="center">View Model Library</h3>

<p align="center">
    <a href="https://www.npmjs.com/package/alas">
        <img src="https://img.shields.io/npm/v/alas.svg">
    </a>
    <a href='https://github.com/KHC-ZhiHao/Alas/actions'>
        <img src='https://github.com/KHC-ZhiHao/Alas/actions/workflows/build-stage.yml/badge.svg'/>
    </a>
    <a href="https://coveralls.io/github/KHC-ZhiHao/Alas?branch=master">
        <img src="https://coveralls.io/repos/github/KHC-ZhiHao/Alas/badge.svg?branch=master" style="max-width:100%;">
    </a>
    <a href="https://standardjs.com/">
        <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" style="max-width:100%;">
    </a>
    <a href="https://github.com/KHC-ZhiHao/Alas">
        <img src="https://img.shields.io/github/stars/KHC-ZhiHao/Alas.svg?style=social">
    </a>
    <br>
</p>

<br>

在此我們只提供簡易說明，詳細介紹 [技術文件](https://khc-zhihao.github.io/Alas/) 中得知。

## Summary

#### 為了UI/UX而生

具有諸多的內置方法與事件都是為了優化流程而設計的。

#### 語系與規則的自我管理

以 Container 為主的擴展方式可以將 Model 快速的遷移至各種專案。

#### 為Vue.js進行優化

Alas 可以說是 Vue 開發的經驗總結，雖然該 Library 不需要運行於其中，但完整支援 Vue 雙向綁定模式。

---

### 安裝

```bash
npm i alas --save
```

---

### 第一隻Model

```js
import Alas from 'alas'

const alas = new Alas()

alas.addModel('user', {
    body: {
        name: ['#ms.type | is: string']
    }
})

const user = alas.make('*', 'user').$init({
    name: 'dave'
})

console.log(user.name) // dave
```

---

### Other

[Version Log](https://github.com/KHC-ZhiHao/Alas/blob/master/version.md)
