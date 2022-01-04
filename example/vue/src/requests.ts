import qs from 'qs'
import Axios, { AxiosResponse } from 'axios'

const axios = Axios.create({
    baseURL: 'https://data.coa.gov.tw/api/v1'
})

// 農產交易系統是以民國為主，因此需要把西元年轉民國年
const timeToROC = (time: string)  => {
    let date = new Date(time)
    let year = date.getFullYear() - 1911
    let month = (date.getMonth() + 1).toString().padStart(2, '0')
    let day = date.getDate().toString().padStart(2, '0')
    return `${year}.${month}.${day}`
}

export const apis = {
    async agriProductsTransType(params: {
        startTime: string
        endTime: string
        cropName: string
        market: string
    }) {
        let query = qs.stringify({
            Start_time: timeToROC(params.startTime),
            End_time: timeToROC(params.endTime),
            CropName: params.cropName,
            MarketName: params.market
        })
        let result = await axios.get(`AgriProductsTransType?${query}`)
        return result as AxiosResponse<{
            RS: string
            Next: boolean
            Data: Array<{
                TransDate: string
                CropCode: string
                CropName: string
                MarketCode: string
                MarketName: string
                Upper_Price: number
                Middle_Price: number
                Lower_Price: number
                Avg_Price: number
                Trans_Quantity: number
            }>
        }>
    }
}
