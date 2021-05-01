<template>
    <div class="p-3">
        <div class="p-3 mx-auto search-form">
            <h3 class="text-center">蔬果交易搜尋系統</h3>
            <div class="text-center pb-2">Alas With Vue Example</div>
            <my-text-field
                label="開始時間"
                v-model="state.transSearch.startTime"
                :rules="state.transSearch.$rules('startTime')">
            </my-text-field>
            <my-text-field
                label="結束時間"
                v-model="state.transSearch.endTime"
                :rules="state.transSearch.$rules('endTime')">
            </my-text-field>
            <my-text-field
                label="作物名稱"
                v-model="state.transSearch.cropName"
                :rules="state.transSearch.$rules('cropName')">
            </my-text-field>
            <my-text-field
                label="商場名稱"
                v-model="state.transSearch.market"
                :rules="state.transSearch.$rules('market')">
            </my-text-field>
            <div class="d-grid gap-2 mt-2">
                <button
                    type="button"
                    class="btn btn-primary"
                    @click="toResult"
                    :disabled="!state.transSearch.$validate().success">
                    查詢
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

/**
 * 在這裡我們複製了狀態 transSearch 的資料，確保我們在修改表單的時候不會異動到狀態的值。
 * @see https://khc-zhihao.github.io/Alas/guide/form.html
 */

import { self } from '@/self'
import { rootStatus } from '@/root-status'
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'search',
    setup() {
        const state = self.data({
            transSearch: rootStatus.fetch('transSearch').$copy()
        })
        const toResult = async() => {
            /**
             * 確定資料後複寫狀態的 transSearch
             */
            rootStatus.set('transSearch', state.transSearch)
            self.router.push({
                name: 'result'
            })
        }
        return {
            state,
            toResult
        }
    }
})
</script>

<style scoped>
    .search-form {
        width: 450px;
        max-width: 80vw;
    }
</style>
