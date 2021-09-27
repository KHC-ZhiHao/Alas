import { expect } from 'chai'
import { loaderSimplify } from '../core/loader'
import Main from '../core/main'

describe('Status', () => {

    it('with model', function() {
        let alas = new Main()
        alas.addContainer('model', {
            models: {
                user: {
                    body: {
                        // @ts-ignore
                        name: []
                    },
                    views: {
                        // @ts-ignore
                        myName: self => self.name
                    }
                }
            }
        })
        let status = alas.registerStatus('', {
            states: {
                user: () => alas.make('model', 'user').$init({
                    name: 'dave'
                })
            }
        })
        //@ts-ignore
        expect(status.fetch('user').name).to.equal('dave')
        expect(status.fetch('user').$v.myName).to.equal('dave')
    })

    it('create', function() {
        let alas = new Main()
        let status = alas.registerStatus('', {
            states: {
                num: () => ({ v: 0 }),
                str: () => ({ v: '0' })
            }
        })
        expect(status.fetch('num').v).to.equal(0)
        expect(status.fetch('str').v).to.equal('0')
    })

    it('reset', function() {
        let alas = new Main()
        let status = alas.registerStatus('', {
            states: {
                num: () => ({ v: 0 })
            }
        })
        expect(status.fetch('num').v).to.equal(0)
        status.fetch('num').v = 10
        expect(status.fetch('num').v).to.equal(10)
        status.reset('num')
        expect(status.fetch('num').v).to.equal(0)
    })

    it('resetAll', function() {
        let alas = new Main()
        let status = alas.registerStatus('', {
            states: {
                num: () => ({ v: 0 })
            }
        })
        expect(status.fetch('num').v).to.equal(0)
        status.fetch('num').v = 10
        expect(status.fetch('num').v).to.equal(10)
        status.resetAll()
        expect(status.fetch('num').v).to.equal(0)
    })

    it('origin state', function() {
        let alas = new Main()
        let status = alas.registerStatus('', {
            states: {
                user() {
                    return {
                        name: 'dave'
                    }
                }
            }
        })
        let user = status.fetch('user')
        user.name = 'steve'
        expect(status.fetch('user').name).to.equal('steve')
        status.reset('user')
        expect(status.fetch('user').name).to.equal('dave')
        expect(user.name).to.equal('dave')
    })

    it('store mode', function() {
        let alas = new Main()
        let Store = class {
            status = alas.registerStatus('', {
                states: {
                    user() {
                        return {
                            name: 'dave'
                        }
                    }
                }
            })
            getUserName() {
                return this.status.fetch('user').name
            }
        }
        let store = new Store()
        expect(store.getUserName()).to.equal('dave')
    })

    it('loaders', function(done) {
        let alas = new Main()
        let status = alas.registerStatus('', {
            states: {
                num: () => ({v: 0})
            },
            loaders: {
                init(self, done, fail, value: number) {
                    status.set('num', {
                        v: status.fetch('num').v += value
                    })
                    done(1)
                }
            }
        })
        status.loaders.init.start(10).then(r => {
            expect(status.fetch('num').v).to.equal(10)
            done()
        })
    })

    it('loader simple', function(done) {
        let alas = new Main()
        let status = alas.registerStatus('', {
            states: {
                num: () => ({v: 0})
            },
            loaders: {
                init: loaderSimplify(async(self, value: number) => {
                    status.set('num', {
                        v: status.fetch('num').v += value
                    })
                    return ''
                })
            }
        })
        status.loaders.init.start(10).then(r => {
            expect(status.fetch('num').v).to.equal(10)
            done()
        })
    })
})

describe('Status Events', () => {
    it('on', function() {
        let alas = new Main()
        let count = 0
        let status = alas.registerStatus('', {
            states: {
                num: () => ({ v: 0 })
            }
        })
        status.on('fetch', (target, context, { name }) => {
            count += 1
            expect(name).to.equal('num')
        })
        status.fetch('num')
        status.fetch('num')
        expect(count).to.equal(2)
    })
    it('once', function() {
        let alas = new Main()
        let count = 0
        let status = alas.registerStatus('', {
            states: {
                num: () => ({ v: 0 })
            }
        })
        status.once('fetch', (target, context, { name }) => {
            count += 1
            expect(name).to.equal('num')
        })
        status.fetch('num')
        status.fetch('num')
        expect(count).to.equal(1)
    })
    it('off', function() {
        let alas = new Main()
        let count = 0
        let status = alas.registerStatus('', {
            states: {
                num: () => ({ v: 0 })
            }
        })
        let t = status.on('fetch', () => {
            count += 1
        })
        status.fetch('num')
        status.off('fetch', t)
        status.fetch('num')
        expect(count).to.equal(1)
    })
    it('reset', function(done) {
        let alas = new Main()
        let status = alas.registerStatus('', {
            states: {
                num: () => ({ v: 0 })
            }
        })
        status.on('reset', (target, context, { name }) => {
            expect(name).to.equal('num')
            done()
        })
        status.reset('num')
    })
})
