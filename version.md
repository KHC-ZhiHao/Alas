## ver 0.4.0

1. email rule 不判斷空字串

## ver 0.3.9

1. list/dictionary clear event
2. Utils ListenerGroup

## ver 0.3.8

1. model $generate method
2. 修正 vue instanceof 回傳結果不正確的問題

## ver 0.3.7

1. 優化 utils 的 typescript 檢查
2. 修正 Vue3 Proxy 掛載錯誤的問題
3. loader 新增 result 屬性

## ver 0.3.6

1. 修正 Vue2 引用 deep watch 會導致 call stack 超過極限的問題
2. group 移除 methods、loaders、views
3. 更好的資料驗證
4. main 有 locale 的屬性

## ver 0.3.5

1. 修正 Vue Plugin import 的問題

## ver 0.3.4

1. 可以在 alas options 中加入 package
2. 修正 instanceof 的參數問題
3. 移除 $methods
4. 移除 $loaders
5. 移除 $views
6. model $rules 不能再進行 extra 擴充
7. 回復 webpack 單檔案結構

## ver 0.3.3

1. 定義 model structure 時分離 body 與 refs
2. 可以使用 Array 建立 Container options
3. 修復 foreach 在 remove item 後導致後面無法查到 model 的 bug
4. 更好的 ts 優化與升級 ts版本
5. vue plugin

## ver 0.3.2

1. model commit method

## ver 0.3.1

1. omit應用在結構中
2. alas name，需要平行擴充時使用
3. reset event 的順序更動
4. model list dir 暴露在程式外部
5. 將isUs等判定轉換成判斷id，防止被掛載proxy後沒反應

## ver 0.3.0

1. 關於更好擴展的策略優化

## ver 0.2.9

1. 修正測試與部屬問題

## ver 0.2.8

1. 簡化 Model 的 Type 定義流程

## ver 0.2.7

1. status set 加回來

## ver 0.2.6

1. TS import 修正

## ver 0.2.5

1. loader event
2. loader message
3. status resetAll
4. event TS輔助更好了
5. core event
6. status name
7. status attr 只接受物件
8. status set 移除
9. rule ts提示修正
10. 修正number、hhmm、mmdd rule
11. 新增in rule

## ver 0.2.2 & 0.2.3 & 0.2.4

1. 針對嚴格模式與linux環境作優化

## ver 0.2.1

1. 可以使用統一的 ContainerTypes 來避免需要大量 import model 的窘境

## ver 0.2.0

1. 某些 model 的 methods 有更好的 ts 提示

## ver 0.1.9

1. 針對 TypeScript 的優化
2. default view 支援 IE11
3. 內置 ms package

## ver 0.1.7 ~ 0.1.8

1. 關於 IE 11 的支援

## ver 0.1.6

1. 針對 TypeScript 的優化

## ver 0.1.5

1. 修正關於 Proxy 的 get 問題

## ver 0.1.3

1. Status使用Proxy時回傳方法時this導向錯誤問題

## ver 0.1.2

1. Status使用Proxy防止狀態錯誤

## ver 0.1.1

1. 系統優化與修正

## ver 0.1.0

1. Status Loader

## ver 0.0.9

1. 修復一些檢查

## ver 0.0.8

1. 更直覺的ts支援

## ver 0.0.7

1. Status
2. list remove event
3. 移除ts ref宣告

## ver 0.0.6

1. copy會跟著複製loader狀態
2. make參數需要兩個
3. addModel移除
4. 更棒的Typescript支援
5. 移除container all methods

## ver 0.0.5

1. Number Rule的驗證更安全了

## ver 0.0.4

1. 完整的Typescript支援
2. 新的rule

## ver 0.0.3

1. 移除batchWriteOnlyKeys

## ver 0.0.2

1. 修正複數BUG

## ver 0.0.1

1. 第一版本釋出
