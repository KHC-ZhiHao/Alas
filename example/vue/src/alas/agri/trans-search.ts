import { ModelStructure, ModelOptions } from 'alas'

/**
 * 定義搜尋交易的表單需要的資料格式，這是一組簡單的 model，可以從下得知是如何定義資料的結構與其規則。
 */

export type TransSearch = ModelStructure<{
    model: {
        startTime: string
        cropName: string
        endTime: string
        market: string
    }
}>

export const TransSearch: ModelOptions<TransSearch> = {
    body: {
        startTime: ['#ms.required', '#ms.yyyymmdd'],
        cropName: ['#ms.required', '#ms.length|max:10'],
        endTime: ['#ms.required', '#ms.yyyymmdd'],
        market: ['#ms.required', '#ms.length|max:10']
    }
}
