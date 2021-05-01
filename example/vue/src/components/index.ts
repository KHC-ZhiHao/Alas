import Loader from './loader.vue'
import Loading from './loading.vue'
import TextField from './text-field.vue'
export default {
    install(vue) {
        vue.component('my-loader', Loader)
        vue.component('my-loading', Loading)
        vue.component('my-text-field', TextField)
    }
}
