import { expect } from 'chai'
import Main from '../core/main'
import { Vue2Plugin, Vue3Plugin } from '../core/vue'
describe('Vue', () => {
    it('Vue2Plugin', function() {
        let main = new Main()
        main.registerStatus('123', {
            states: {},
            loaders: {
                test: () => ''
            }
        })
        Vue2Plugin.install({ observable: () => '' }, {
            alas: main
        })
        main.registerStatus('1234', {
            states: {}
        })
    })
    it('Vue3Plugin', function() {
        let main = new Main()
        main.registerStatus('123', {
            states: {},
            loaders: {
                test: () => ''
            }
        })
        Vue3Plugin.install({}, {
            alas: main,
            reactive: () => ''
        })
        main.registerStatus('1234', {
            states: {}
        })
    })
})
