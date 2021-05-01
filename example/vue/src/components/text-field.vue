<template>
    <div class="pb-3">
        <div class="mb-1">{{ label }}</div>
        <input style="width: 100%;" v-model="state.value" type="text">
        <div class="text-small" style="color: red" v-if="error">{{ error }}</div>
    </div>
</template>

<script lang="ts">
import { self } from '@/self'
import { computed, defineComponent, PropType, watch } from 'vue'
export default defineComponent({
    name: 'component-text-fields',
    emits: ['update:modelValue'],
    props: {
        modelValue: {},
        label: {
            type: String,
            required: true
        },
        rules: {
            type: Array as PropType<Array<(value: any) => true | string>>
        },
    },
    setup(props, { emit }) {
        const state = self.data({
            value: props.modelValue
        })
        const error = computed(() => {
            return props.rules.map(rule => rule(state.value)).filter(e => e !== true)[0]
        })
        watch(() => state.value, () => {
            emit('update:modelValue', state.value)
        })
        watch(() => props.modelValue, () => {
            state.value = props.modelValue
        })
        return {
            state,
            error
        }
    }
})
</script>

<style scoped>
    .text-small {
        font-size: 0.85em;
    }
</style>
