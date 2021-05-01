<template>
    <div>
        <div class="text-center" v-if="state.started && state.called === false">尚無資料</div>
        <my-loading v-else :loading="state.loading" :error="state.error">
            <slot v-if="state.loading === false"></slot>
        </my-loading>
    </div>
</template>

<script lang="ts">

/**
 * 這個 component 可以接收複數 loader，來呈現多種加載狀態的畫面如何呈現。
 * @see https://khc-zhihao.github.io/Alas/structure/loader.html
 */

import { Loader } from 'alas'
import { defineComponent, onMounted, PropType, reactive, watch } from 'vue'
export default defineComponent({
    name: 'component-loader',
    props: {
        items: {
            require: true,
            type: Array as PropType<Loader<any>[]>
        }
    },
    setup(props) {
        const state = reactive({
            loading: true,
            error: undefined,
            called: false,
            started: false,
            int: null
        })
        watch(() => props.items, () => handler(), {
            deep: true
        })
        onMounted(() => {
            setTimeout(() => handler(), 10)
        })
        let handler = () => {
            let error
            let called = false
            let loading = false
            let items = props.items
            for (let loader of items) {
                if (loader.called) {
                    called = true
                }
            }
            for (let loader of items) {
                if (loader.loading) {
                    loading = true
                }
            }
            for (let loader of items) {
                if (loader.error) {
                    error = loader.error
                }
            }
            state.error = error
            state.called = called
            state.loading = loading
            state.started = true
        }
        return {
            state
        }
    }
})
</script>
