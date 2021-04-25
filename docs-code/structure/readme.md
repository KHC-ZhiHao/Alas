# 結構

本單元將介紹主要的系統架購，在指南單元中，大部分的例子是直接透過 `addModel` 註冊 Model，然而 Alas 本質上是為了中大規模的專案去設計的，因此將所有 Model 註冊在 Global Container 顯然是不可行的方案，本章節將講解整體分層結構，可以從下圖得知一些大方向：

<Cimg text="ALAS 基礎結構" src="alas-structure.png"></Cimg>

::: tip 建議
我們推薦使用 webpack + TypeScript 開始你的專案，以下例子都以這個環境為例。
:::
