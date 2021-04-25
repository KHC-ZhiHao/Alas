import Main from './main'
export const Vue2Plugin = {
    install(Vue: any, { alas }: { alas: Main }) {
        function reg(status: any) {
            Vue.observable(status._states)
            for (let key in status._loaders._items) {
                Vue.observable(status._loaders._items[key])
            }
        }
        alas._statuses.forEach((status: any) => reg(status))
        alas.on('registeredStatus', (self, context, status) => {
            reg(status)
        })
    }
}

export const Vue3Plugin = {
    install(app: any, { alas, reactive }: { alas: Main, reactive: any }) {
        function reg(status: any) {
            status._states = reactive(status._states)
            for (let key in status._loaders._items) {
                status._loaders._items[key] = reactive(status._loaders._items[key])
            }
        }
        alas._statuses.forEach((status: any) => reg(status))
        alas.on('registeredStatus', (self, context, status) => {
            reg(status)
        })
    }
}
