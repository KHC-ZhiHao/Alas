import { apis } from '@/requests'
import { TransSearch } from './trans-search'
import { ModelStructure, ModelOptions, Loader } from 'alas'

/**
 * 當這組 model 有複數資料的時候，我們需要定義 list 的呈現方式。
 * @see https://khc-zhihao.github.io/Alas/structure/list.html
 */

export type Trans = ModelStructure<{
    model: {
        transDate: string
        cropCode: string
        cropName: string
        marketCode: string
        marketName: string
        upperPrice: number
        middlePrice: number
        lowerPrice: number
        avgPrice: number
        transQuantity: number
    }
    list: {
        v: Readonly<{
            avgPrice: string
            totalTransQuantity: string
        }>
        o: Readonly<{
            fetch: Loader<null, TransSearch['model']>
        }>
    }
}>

export const Trans: ModelOptions<Trans> = {
    
    /**
     * 因為 Trans 的資料不用檢查，所以偷懶通通設定成空規則，是否需要定義規則視情況而定。
     */

    body: {
        transDate: [],
        cropCode: [],
        cropName: [],
        marketCode: [],
        marketName: [],
        upperPrice: [],
        middlePrice: [],
        lowerPrice: [],
        avgPrice: [],
        transQuantity: []
    },

    /**
     * 可以透過 init 攔截 source data 來統一開發介面
     */

    init(self, source = {}) {
        return {
            transDate: source.TransDate,
            cropCode: source.CropCode,
            cropName: source.CropName,
            marketCode: source.MarketCode,
            marketName: source.MarketName,
            upperPrice: source.Upper_Price,
            middlePrice: source.Middle_Price,
            lowerPrice: source.Lower_Price,
            avgPrice: source.Avg_Price,
            transQuantity: source.Trans_Quantity
        }
    },
    list: {

        /**
         * 定義 key 可以讓 "交易日期 + 拍賣市場" 的字串成為 keyword，如果有相同的鍵值則會複寫，避免加總錯誤發生。
         */

        key: model => model.transDate + model.marketCode,

        /**
         * views 可以在 model 層級處理複雜的資料後輸出
         */

        views: {
            avgPrice(self) {
                if (self.size === 0) {
                    return '無資料'
                }
                let output = 0
                self.forEach(model => {
                    output += model.avgPrice
                })
                return (output / self.size).toFixed(2)
            },
            totalTransQuantity(self) {
                if (self.size === 0) {
                    return '無資料'
                }
                let output = 0
                self.forEach(model => {
                    output += model.transQuantity
                })
                return output.toFixed(2)
            }
        },

        /**
         * loader 負責向開放 API 請求資料，並將資料寫入 list 中。
         */

        loaders: {
            async fetch(self, done, fail, transSearch) {
                try {
                    let result = await apis.agriProductsTransType({
                        market: transSearch.market,
                        cropName: transSearch.cropName,
                        endTime: transSearch.endTime,
                        startTime: transSearch.startTime
                    })
                    self.clear()
                    self.batchWrite(result.data.Data)
                    done(null)
                } catch (error) {
                    fail(error)
                }
            }
        }
    }
}
