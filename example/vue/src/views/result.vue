<template>
    <div class="p-3">
        <div class="p-3 mx-auto result">
            <div class="text-center pb-3">
                <h3>查詢結果</h3>
                <div class="link-primary" @click="backSearch">回搜尋</div>
            </div>
            <my-loader :items="[state.trans.o.fetch]">
                <div>
                    <div class="card mb-2">
                        <div class="card-body">
                            <h5 class="card-title">{{ transSearch.startTime }} ~ {{ transSearch.endTime }}</h5>
                            <div class="card-text">商品: {{ transSearch.cropName }}</div>
                            <div class="card-text">市場: {{ transSearch.market }}</div>
                            <!-- 這裡透過 views 獲取資料計算結果，而不是透過 vue 進行計算，對 vue 重構相對友好 -->
                            <div class="card-text">總均價: {{ state.trans.v.avgPrice }}</div>
                            <div class="card-text">總交易量: {{ state.trans.v.totalTransQuantity }}</div>
                        </div>
                    </div>
                    <div class="text-center pb-3 pt-1">細節</div>
                    <!-- 我們可以藉由 list.items 顯示多筆資料 -->
                    <div v-if="state.trans.size === 0"  class="text-center" style="color: red">
                        無資料
                    </div>
                    <div
                        class="card mb-2"
                        v-else
                        v-for="(trans, index) in state.trans.items"
                        :key="index">
                        <div class="card-body">
                            <h5 class="card-title">{{ trans.transDate }}</h5>
                            <div class="card-text">均價: {{ trans.avgPrice }}</div>
                            <div class="card-text">交易量: {{ trans.transQuantity }}</div>
                        </div>
                    </div>
                </div>
            </my-loader>
        </div>
    </div>
</template>

<script lang="ts">
import { self } from '@/self'
import { alas } from '@/alas'
import { rootStatus } from '@/root-status'
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
    name: 'result',
    setup() {
        const transSearch = rootStatus.fetch('transSearch')
        const state = self.data({
            trans: alas.makeList('Agri', 'Trans')
        })
        const backSearch = () => {
            self.router.push({
                name: 'search'
            })
        }

        /**
         * 可以驗證目前的資料是否符合其規則，如果不符合則跳回到表單。
         */

        onMounted(() => {
            if (transSearch.$validate().success) {
                state.trans.o.fetch.start(transSearch)
            } else {
                backSearch()
            }
        })

        return {
            state,
            backSearch,
            transSearch
        }
    }
})
</script>

<style scoped>
    .result {
        width: 500px;
        max-width: 80vw;
    }
</style>
