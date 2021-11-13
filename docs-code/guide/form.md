# 搞定 Vue 表單如此容易

表單設計可以說是前端工作人員最繁複但又最無聊的橋段，一個嚴謹又具有高反饋性的輸入框需要大量的重複性作業，由於 Alas 在定義 Model 的結構時會同時定義規則，我們可以利用這點來快速建立一個嚴謹的表單系統，假設我們 Model 的結構如下：

::: tip 提醒
本章節將會使用 Rule 與 Locale 進行展示，你可以前往 [Package](../structure/package.md) 章節得知這兩種屬性的運作模式。
:::

老規矩，我們先建立 User Model：

```js
const alas = new Alas()
alas.addModel('user', {
    body: {
        name: ['#ms.required']
    }
})
```

## Simple Form

接下來，我們在 Vue 定義表單如下，就能在 user.name 是空的情況下獲得錯誤訊息的提示：

```vue
<template>
    <form>
        <div>姓名</div>
        <input v-model="user.name" type="text">
        <!-- 如果 validateBy 回傳不是 true，意味著是錯誤訊息 -->
        <div v-if="error !== true" style="color: red">{{ error }}</div>
    </form>
</template>
<script>
    import { defineComponent, ref, computed } from 'vue'
    export default defineComponent({
        setup() {
            const user = ref(alas.make('*', 'user'))
            const error = computed(() => user.value.$validateBy('name'))
            return {
                user,
                error
            }
        }
    })
</script>
```

## UI Framework

上述展示了在原生 HTML 下是如何呈現驗證的，但應用在 Vue UI 庫才能讓 Rules 發揮真正的作用。

### Vuetify

Rule 的驗證結果回傳 `true` 意味著成功，而字串回傳失敗的特性與 Vuetify 本身的驗證規則一致，因此當使用 Vuetify 進行開發的時候並不需要進行任何的加工行為。

```vue
<template>
    <v-form>
        <v-text-field
            label="姓名"
            v-model="user.name"
            :rules="user.$rules('name')"
        ></v-text-field>
    </v-form>
</template>
<script>
    import { defineComponent, ref, computed } from 'vue'
    export default defineComponent({
        setup() {
            return {
                user: ref(alas.make('*', 'user'))
            }
        }
    })
</script>
```

### Element UI+

Element UI+ 的驗證規則是針對一個 Model 進行確認，這意味著我們必須編寫一段轉換成相對應規則的規則的程式碼：

```js
const modelToElementFormRules = (model) => {
    const body = model._model.options.body
    const rules = {}
    for (let name in body) {
        rules[name] = [
            {
                trigger: ['blur', 'change'],
                validator: (rule, value, callback) => {
                    let result = model.$validateBy(name)
                    if (result === true) {
                        callback()
                    } else {
                        callback(new Error(result))
                    }
                }
            }
        ]
        if (body[name].includes('#ms.required')) {
            rules[name].push({
                required: true,
                message: alas.meg('#ms.required'),
                trigger: ['blur', 'change']
            })
        }
    }
    return rules
}
```

接下來只要在 Vue File 中實體化就行了：

```vue
<template>
    <el-form :model="user" :rules="rules">
        <el-form-item prop="name" :label="$t('桌號')">
            <el-input v-model="user.name"></el-input>
        </el-form-item>
    </el-form>
</template>
<script>
    import { defineComponent, ref } from 'vue'
    export default defineComponent({
        setup() {
            const user = ref(alas.make('*', 'user'))
            const rules = modelToElementFormRules(user)
            return {
                user,
                rules
            }
        }
    })
</script>
```

## Vue Form Component

大多時候我們會有把表單分離出 Component，讓新刪修查的行為共用同一組表單，但 Vue 本身對這個概念並不直覺，但可以透過 Alas 來完善整個流程。

```vue
<!-- Form.vue -->
<template>
    <div>
        <div>姓名</div>
        <input v-model="user.name" type="text">
        <button @click="submit"></button>
    </div>
</template>
<script>
import { defineComponent, onMounted, reactive, watch } from 'vue'
export default defineComponent({
    props: {
        user: {
            type: Object,
            required: false
        }
    },
    emits: ['submit'],
    setup(props, context) {
        const state = reactive({
            user: null
        })
        watch(() => props.user, () => sync())
        onMounted(() => sync())
        const sync = () => {
            if (props.user) {
                // 我們不能在 component 中直接修改 prop 的值，但可以直接複製一份而不需要再發送一次請求。
                state.user = props.user.$copy()
            } else {
                // 如果沒有帶入 model 則新增一組新的
                state.user = alas.make('*', 'user').$init()
            }
        }
        const submit = () => {
            let validate = state.user.validate()
            if (validate.success) {
                // 如果驗證成功可以把資料送出，完成整個表單的任務
                context.emit('submit', state.user.$copy())
            } else [
                alert('表單驗證有誤')
            ]
        }
        return {
            state,
            submit
        }
    }
})
</script>
```

接下來我們只要將表單引用進主要頁面即可：

```vue
<template>
    <div>
        <div>更新</div>
        <Form :user="state.user" @submit="update"></Form>
    </div>
</template>

<script>
import Form from './Form.vue'
import { defineComponent, onMounted, reactive } from 'vue'
export default defineComponent({
    components: {
        Form
    },
    setup() {
        const state = reactive({
            user: alas.make('*', 'user').$init()
        })
        const update = (user) => {
            // do update...
        }
        return {
            state,
            update
        }
    }
})
</script>
```
