import { expect } from 'chai'
import * as User from './fake/user'
import Main from '../core/main'
import GetSet from '../core/get-set'

function getUser(name: string) {
    let main = new Main<{
        user: User.Structure
    }>()
    main.addContainer('user', User.Container)
    let a = main.make('user', 'user')
    let b = a.$init()
    b.name
    return main.make('user', 'user').$init({
        Name: name
    })
}

describe('Model', () => {

    it('loader simple', function(done) {
        let user = getUser('dave')
        expect(user.$o.getNameSimple.called).to.equal(false)
        user.$o.getNameSimple.start('my name is ')
            .then((value) => {
                expect(value).to.equal('my name is dave')
                expect(user.$o.getNameSimple.result).to.equal('my name is dave')
                expect(user.$o.getNameSimple.done).to.equal(true)
                expect(user.$o.getNameSimple.called).to.equal(true)
                expect(!!user.$loader.loading).to.equal(false)
                expect(user.$o.getNameSimple.loading).to.equal(false)
                done()
            })
        expect(user.$o.getNameSimple.called).to.equal(true)
        expect(user.$o.getNameSimple.result).to.equal(null)
        expect(user.$o.getNameSimple.loading).to.equal(true)
        expect(!!user.$loader.loading).to.equal(true)
        expect(user.$o.getNameSimple.done).to.equal(false)
    })

    it('generate', function() {
        let user = getUser('dave')
        let newUser = user.$generate().$init({
            Name: 'james'
        })
        expect(newUser.$v.name).to.equal('my name is james')
    })

    it('system model', function() {
        let main = new Main()
        main.addContainer('user', {
            models: {
                user: {
                    body: {
                        // @ts-ignore
                        name: ['#ms.required']
                    },
                    defs: {
                        // @ts-ignore
                        name: () => 'dave'
                    }
                }
            }
        })
        let user = main.make('user', 'user').$init()
        // @ts-ignore
        expect(user.name).to.equal('dave')
    })

    it('views', function() {
        let user = getUser('dave')
        expect(user.$v.name).to.equal('my name is dave')
    })

    it('commit', function() {
        let user = getUser('dave')
        user.name = '4321'
        expect(user.$isChange()).to.equal(true)
        user.$commit()
        expect(user.$isChange()).to.equal(false)
        user.name = 'dave'
        expect(user.$isChange()).to.equal(true)
    })

    it('get set model', function() {
        let user = getUser('dave')
        let result = GetSet(user, {
            get(target, key) {
                return target[key]
            },
            set(target, key, value) {
                target[key] = value + '5'
            }
        }, false)
        expect(result.name).to.equal('dave')
        result.name = '1234'
        expect(result.name).to.equal('12345')
    })

    it('body', function() {
        let user = getUser('dave')
        let body = user.$body()
        body.id = 1234
        expect(body).to.eql({
            id: 1234,
            name: 'dave',
            children: [],
            attributes: {
                phone: null
            }
        })
    })

    it('rules', function() {
        let user = getUser('dave')
        expect(user.$rules('name')).to.be.a('array')
    })

    it('loaders', function(done) {
        let user = getUser('dave')
        expect(user.$o.getName.called).to.equal(false)
        user.$o.getName.start('my name is ')
            .then((value: any) => {
                expect(value).to.equal('my name is dave')
                expect(user.$o.getName.result).to.equal('my name is dave')
                expect(user.$o.getName.done).to.equal(true)
                expect(user.$o.getName.called).to.equal(true)
                expect(!!user.$loader.loading).to.equal(false)
                expect(user.$o.getName.loading).to.equal(false)
                done()
            })
        expect(user.$o.getName.called).to.equal(true)
        expect(user.$o.getName.result).to.equal(null)
        expect(user.$o.getName.loading).to.equal(true)
        expect(!!user.$loader.loading).to.equal(true)
        expect(user.$o.getName.done).to.equal(false)
    })

    it('loaders error', function(done) {
        let user = getUser('dave')
        expect(user.$loader.error).to.equal(null)
        expect(user.$o.getError.error).to.equal(null)
        user.$o.getError.start('my name is ')
            .catch((value: any) => {
                expect(value).to.equal('my name is dave')
                expect(user.$o.getError.error).to.equal('my name is dave')
                expect(user.$loader.error).to.eql({
                    key: 'getError',
                    value: 'my name is dave'
                })
                done()
            })
    })

    it('loaders seek', function(done) {
        let now = Date.now()
        let user = getUser('dave')
        user.$o.getName.seek('my name is ')
            .then((value: any) => {
                expect(value).to.equal('my name is dave')
                expect(Date.now() - now > 30).to.equal(true)
                done()
            })
    })

    it('loaders by copy', function(done) {
        let user = getUser('dave')
        user.$o.getName.start('my name is ')
            .then((value: any) => {
                expect(value).to.equal('my name is dave')
                expect(user.$o.getName.done).to.equal(true)
                let newUser = user.$copy()
                expect(newUser.$o.getName.done).to.equal(true)
                expect(newUser.$o.getName.called).to.equal(true)
                done()
            })
    })

    it('loaders seek 2', function(done) {
        let user = getUser('dave')
        user.$o.getName.start('my name is ')
            .then((value: any) => {
                expect(value).to.equal('my name is dave')
                let now = Date.now()
                user.$o.getName.seek('')
                    .then(() => {
                        expect(Date.now() - now < 50).to.equal(true)
                        done()
                    })
            })
    })

    it('loaders seek error', function(done) {
        let user = getUser('dave')
        user.$o.getError.start('my name is ')
            .catch((value: any) => {
                expect(value).to.equal('my name is dave')
                let now = Date.now()
                process.nextTick(() => {
                    user.$o.getError.seek('')
                        .catch(() => {
                            expect(Date.now() - now < 50).to.equal(true)
                            done()
                        })
                })
            })
    })

    it('methods', function() {
        let user = getUser('dave')
        expect(user.$m.getName('my name is ')).to.equal('my name is dave')
    })

    it('configs', function() {
        let user = getUser('dave')
        expect(user.$config.test).to.equal('test')
    })

    it('default', function() {
        let user = getUser('dave')
        expect(user.id).to.be.a('number')
    })

    it('utils', function() {
        let user = getUser('dave')
        expect(user.$utils.generateId()).to.be.a('string')
    })

    it('ready', function() {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        let user = main.make('user', 'user')
        let readyUser = getUser('dave')
        expect(user.$ready).to.equal(false)
        expect(readyUser.$ready).to.equal(true)
    })

    it('error', function() {
        let user = getUser('dave')
        expect(user.$error).to.equal('Error null')
        user.$setError('error')
        expect(user.$error).to.equal('Error error')
    })

    it('parent', function() {
        let user = getUser('dave')
        expect(user.$parent).to.equal(null)
        expect(user.attributes.$parent).to.equal(user)
    })

    it('raw', function() {
        let user = getUser('dave')
        expect(user.$raw()).to.eql({
            Name: 'dave'
        })
    })

    it('copy', function() {
        let user = getUser('dave')
        expect(user.name).to.equal('dave')
        let newUser = user.$copy()
        expect(newUser.name).to.equal('dave')
        newUser.name = 'stave'
        expect(user.name).to.equal('dave')
        expect(newUser.name).to.equal('stave')
    })

    it('keys', function() {
        let user = getUser('dave')
        expect(user.$keys()).to.eql([ 'id', 'name', 'children', 'attributes' ])
    })

    it('validate by not include body', function() {
        let user = getUser('dave')
        // @ts-ignore
        expect(() => user.$validateBy('123')).to.throw(Error)
    })

    it('reset', function() {
        let user = getUser('dave')
        expect(user.name).to.equal('dave')
        user.name = 'stave'
        expect(user.name).to.equal('stave')
        user.$reset()
        expect(user.name).to.equal('dave')
        expect(user.id).to.be.a('number')
        // @ts-ignore
        user.id = '123'
        user.$reset('id')
        expect(user.id).to.be.a('number')
    })

    it('profile', function() {
        let user = getUser('dave')
        user.id = 292345
        user.$self.test = 'test'
        expect(user.$profile()).to.eql({
            id: 292345,
            name: 'dave',
            children: [],
            attributes: { phone: null },
            $self: {
                test: 'test'
            },
            $views: { name:
                'my name is dave'
            },
            $status: {
                initd: true,
                error: null,
                ready: true
            },
            $options: {
                save: true
            },
            $profile: {
                baseName: 'user',
                containerName: 'user'
            }
        })
    })

    it('export', function() {
        let user = getUser('dave')
        expect(user.$export()).to.eql({
            Name: 'dave',
            Children: [],
            Attributes: {
                Phone: null
            }
        })
    })

    it('reload', function() {
        let user = getUser('dave')
        expect(user.name).to.equal('dave')
        user.$reload({
            Name: 'stave'
        })
        expect(user.name).to.equal('stave')
    })

    it('isChange', function() {
        let user = getUser('dave')
        expect(user.$isChange()).to.equal(false)
        user.name = 'stave'
        expect(user.$isChange()).to.equal(true)
        expect(user.$isChange('id')).to.equal(false)
        expect(user.$isChange('name')).to.equal(true)
    })

    it('isChange children', function() {
        let user = getUser('dave')
        expect(user.$isChange()).to.equal(false)
        // @ts-ignore
        user.attributes.phone = '123'
        expect(user.$isChange()).to.equal(true)
    })

    it('validate', function() {
        let user = getUser('dave')
        expect(user.$validate().success).to.equal(true)
        // @ts-ignore
        user.name = null
        expect(user.$validate().result.name).to.equal('Required')
        expect(user.$validate().success).to.equal(false)
    })

    it('options', function() {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        let user = main.make('user', 'user', {
            save: false
        })
        expect(() => user.$reset()).to.throw(Error)
    })

    it('watch', function(done) {
        let user = getUser('dave')
        user.$on('name-change', (self: any, context: any, newValue: any) => {
            expect(newValue).to.equal('stave')
            done()
        })
        user.name = 'stave'
    })

    it('self', function() {
        let main = new Main()
        main.addContainer('test', {
            models: {
                test: {
                    self() {
                        return {
                            test: '123'
                        }
                    }
                }
            }
        })
        let test = main.make('test', 'test')
        expect(!!test.$self.test).to.equal(false)
        test.$init()
        expect(test.$self.test).to.equal('123')
    })

    it('default view', function() {
        let main = new Main()
        main.addContainer('test', {
            models: {
                test: {
                    views: {
                        test() {
                            return 'test'
                        }
                    },
                    defaultView(self, key) {
                        return key
                    }
                }
            }
        })
        let test = main.make('test', 'test')
        expect(test.$v.test).to.equal('test')
        expect(test.$v.test2).to.equal('test2')
    })

    it('inited', function(done) {
        let main = new Main()
        main.addContainer('test', {
            models: {
                test: {
                    inited() {
                        done()
                    }
                }
            }
        })
        main.make('test', 'test').$init()
    })

    it('getRule error', function() {
        expect(() => {
            let user = getUser('dave')
            // @ts-ignore
            user.$rules(['1234'])
        }).to.throw(Error)
    })

    it('getRawdata no save', function() {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        let user = main.make('user', 'user', {
            save: false
        })
        expect(() => {
            user.$raw()
        }).to.throw(Error)
    })

    it('isChange no save', function() {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        let user = main.make('user', 'user', {
            save: false
        })
        expect(() => {
            user.$isChange()
        }).to.throw(Error)
    })

    it('twice init', function() {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        let user = main.make('user', 'user', {
            save: false
        })
        user.$init()
        expect(() => {
            user.$init()
        }).to.throw(Error)
    })

    it('reset error', function() {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        let user = main.make('user', 'user')
        expect(() => {
            // @ts-ignore
            user.$reset('1234')
        }).to.throw(Error)
    })

    it('body has function', function() {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        expect(() => {
            main.make('user', 'user').$init({
                Name: () => ''
            })
        }).to.throw(Error)
    })

    it('default error message', function() {
        let main = new Main()
        main.addContainer('test', {
            models: {
                test: {}
            }
        })
        let test = main.make('test', 'test')
        let test2 = main.make('test', 'test')
        test.$setError('123')
        test2.$setError()
        expect(test.$error).to.equal('123')
        expect(test2.$error).to.equal('Unknown error')
    })
})

describe('Event', () => {

    it('on', function(done) {
        let user = getUser('dave')
        user.$on('test', (self: any, context: any, n1: any, n2: any) => {
            expect(n1).to.equal(1)
            expect(n2).to.equal(2)
            done()
        })
        user.$emit('test', 1, 2)
    })

    it('once', function(done) {
        let user = getUser('dave')
        let count = 0
        user.$once('test', (self: any, context: any) => {
            count += 1
        })
        user.$emit('test')
        user.$emit('test')
        setTimeout(() => {
            expect(count).to.equal(1)
            done()
        }, 20)
    })

    it('off', function(done) {
        let user = getUser('dave')
        let count = 0
        let id = user.$on('test', (self: any, context: any) => {
            count += 1
            user.$off('test', id)
            user.$emit('test')
        })
        user.$emit('test')
        setTimeout(() => {
            expect(count).to.equal(1)
            done()
        }, 20)
    })

    it('ready', function(done) {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        let user = main.make('user', 'user')
        user.$on('$ready', () => {
            done()
        })
        user.$init()
    })

    it('error', function(done) {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        let user = main.make('user', 'user')
        user.$on('$error', () => {
            done()
        })
        user.$setError()
    })
})


describe('Loader', () => {
    it('message', function(done) {
        let user = getUser('dave')
        user.$o.getName.on('setMessage', (self: any, context: any, message: any) => {
            expect(message).to.equal('123')
            done()
        })
        user.$o.getName.setMessage('123')
        expect(user.$o.getName.message).to.equal('123')
    })
    it('event - success', function(done) {
        let user = getUser('dave')
        user.$o.getName.on('success', (self: any, context: any, result: any) => {
            expect(result).to.equal('123dave')
            done()
        })
        user.$o.getName.start('123')
    })
    it('event - error', function(done) {
        let user = getUser('dave')
        user.$o.getError.on('error', (self: any, context: any, error: any) => {
            expect(error).to.equal('123dave')
            done()
        })
        user.$o.getError.start('123').catch(() => '')
    })
    it('event - start', function(done) {
        let user = getUser('dave')
        user.$o.getName.on('start', (self: any, context: any) => {
            done()
        })
        user.$o.getName.start('123')
    })
})
