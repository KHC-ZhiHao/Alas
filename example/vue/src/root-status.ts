import { alas } from '@/alas'

/**
 * 把搜尋資料託管給 Status，讓他可以跨 result.vue、search.vue 溝通。
 * @see https://khc-zhihao.github.io/Alas/guide/status.html#vuex
 */

export const rootStatus = alas.registerStatus('RootStatus', {
    states: {
        transSearch: () => alas.make('Agri', 'TransSearch').$init({
            startTime: '2018-07-01',
            endTime: '2018-07-10',
            market: '台北一',
            cropName: '球莖甘藍'
        })
    }
})
