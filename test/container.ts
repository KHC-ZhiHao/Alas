import { expect } from 'chai'
import Main from '../core/main'
import * as User from './fake/user'

let main = new Main<{ user: User.Structure }>()

main.addContainer('user', User.Container as any)

describe('Container', () => {

    it('rules', function() {
        let user = main.make('user', 'user').$init()
        expect(user.$validateBy('id')).to.equal(true)
        // @ts-ignore
        user.id = '錯誤'
        expect(user.$validateBy('id')).to.equal('error')
    })

    it('locales', function() {
        let user = main.make('user', 'user').$init()
        expect(user.$meg('hello', { name: 'dave' })).to.equal('Hello dave.')
        main.setLocale('zh-tw')
        expect(user.$meg('hello', { name: '戴夫' })).to.equal('你好 戴夫。')
    })

    it('interface', function() {
        main.addContainer('interface', {
            models: {
                test: {
                    body: {
                        // @ts-ignore
                        name: []
                    }
                }
            },
            interface: {
                body: ['name']
            }
        })
    })

    it('interface all', function() {
        main.addContainer('interfaceAll', {
            models: {
                test: {
                    body: {
                        // @ts-ignore
                        name: []
                    },
                    views: {
                        name: () => ''
                    },
                    methods: {
                        getName: () => ''
                    },
                    loaders: {
                        getName: () => ''
                    }
                }
            },
            interface: {
                body: ['name'],
                views: ['name'],
                methods: ['getName'],
                loaders: ['getName']
            }
        })
    })

    it('interface error', function() {
        expect(() => {
            main.addContainer('interfaceError', {
                models: {
                    test: {
                        body: {
                            // @ts-ignore
                            text: []
                        }
                    }
                },
                interface: {
                    body: ['name']
                }
            })
        }).to.throw(Error)
    })

    it('config', function() {
        let user = main.make('user', 'user')
        expect(user.$config.test).to.equal('test')
    })

    it('message', function() {
        let user = main.make('user', 'user')
        expect(user.$meg('123')).to.equal('$user.123')
    })

    it('make error', function() {
        // @ts-ignore
        expect(() => main.make('usera/user')).to.throw(Error)
    })

    it('make list error', function() {
        // @ts-ignore
        expect(() => main.makeList('usera/user')).to.throw(Error)
    })
})
