import { expect } from 'chai'
import Main from '../core/main'
import * as User from './fake/user'
import Package from './fake/package'

describe('Main', () => {

    it('generateSimplifyLoader', function(done) {
        let fetch = Main.generateSimplifyLoader(async(context, data: string) => {
            await new Promise(resolve => {
                setTimeout(() => resolve(null), 100)
            })
            return data
        })
        fetch.on('success', () => {
            expect(fetch.loading).to.equal(false)
            expect(fetch.result).to.equal('hello')
            done()
        })
        expect(fetch.loading).to.equal(false)
        fetch('hello')
        expect(fetch.loading).to.equal(true)
    })

    it('generateSimplifyLoader Error', function(done) {
        let fetch = Main.generateSimplifyLoader(async(context, data: string) => {
            await new Promise(resolve => {
                setTimeout(() => resolve(null), 100)
            })
            throw 'error'
        })
        fetch.on('error', () => {
            expect(fetch.loading).to.equal(false)
            expect(fetch.error).to.equal('error')
            done()
        })
        expect(fetch.loading).to.equal(false)
        fetch('hello')
        expect(fetch.loading).to.equal(true)
    })

    it('setLocal', function() {
        let main = new Main()
        expect(main.locale).to.equal('en-us')
        main.setLocale('zh-tw')
        expect(main.locale).to.equal('zh-tw')
    })

    it('addModel', function() {
        let main = new Main()
        main.addModel('user', {
            body: {
                name: []
            }
        })
        let user = main.make('*', 'user').$init({
            name: 'james'
        })
        // @ts-ignore
        expect(user.name).to.equal('james')
    })


    it('addContainer', function() {
        let main = new Main()
        // @ts-ignore
        let id = main.addContainer('user', User.Container, { installed: true })
        let user = main.make('user', 'user')
        expect(id).to.be.a('string')
        expect(user.$config.installed).to.equal(true)
    })

    it('meg', function() {
        let main = new Main()
        expect(main.meg('#ms.123')).to.equal('#ms.123')
        main.addPackage(Package)
        expect(main.meg('#ms.required')).to.equal('Required')
        expect(main.meg('#test.hello', { value: 'dave' })).to.equal('Hello dave')
        main.setLocale('zh-tw')
        expect(main.meg('#ms.required')).to.equal('必填')
        main.setLocale('ja')
        expect(main.meg('#ms.required')).to.equal('Required')
    })

    it('make', function() {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        let user = main.make('user', 'user').$init({ Name: 'tony' })
        // @ts-ignore
        expect(user.name).to.equal('tony')
    })

    it('makeList', function() {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        let user = main.makeList('user', 'user')
        expect(user.items).to.be.a('array')
    })

    it('getRules', function() {
        let main = new Main()
        let rules = main.rules(['#ms.required'])
        expect(rules).to.be.a('array')
        expect(rules[0]()).to.equal('Required')
        expect(rules[0]('123')).to.equal(true)
    })

    it('getRules Not Fount', function() {
        let main = new Main()
        expect(() => {
            main.rules(['#ms.qqqqq'])
        }).to.throw(Error)
    })

    it('instanceof', function() {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        expect(() => {
            main.instanceof('user', 'user', 123)
        }).to.throw(Error)
        let user = main.make('user', 'user')
        let attr = main.make('user', 'attributes')
        expect(main.instanceof('user', 'user', user)).to.equal(true)
        expect(main.instanceof('user', 'user', attr)).to.equal(false)
        let userList = main.makeList('user', 'user')
        let attrList = main.makeList('user', 'attributes')
        expect(main.instanceof('user', 'user', userList)).to.equal(true)
        expect(main.instanceof('user', 'user', attrList)).to.equal(false)
        let userDictionary = main.makeDictionary('user', 'user')
        let attrDictionary = main.makeDictionary('user', 'attributes')
        expect(main.instanceof('user', 'user', userDictionary)).to.equal(true)
        expect(main.instanceof('user', 'user', attrDictionary)).to.equal(false)
    })

    it('utils', function() {
        let main = new Main()
        expect(main.utils.generateId()).to.be.a('string')
        expect(Main.utils.generateId()).to.be.a('string')
    })
})


describe('Main Event', () => {
    it('makedModel', function(done) {
        let main = new Main()
        main.addContainer('user', User.Container)
        main.on('makedModel', (self, context, model) => {
            expect(main.instanceof('user', 'user', model)).to.equal(true)
            done()
        })
        main.make('user', 'user')
    })
    it('makedList', function(done) {
        let main = new Main()
        main.addContainer('user', User.Container)
        main.on('makedList', (self, context, list) => {
            expect(main.instanceof('user', 'user', list)).to.equal(true)
            done()
        })
        main.makeList('user', 'user')
    })
    it('makedDictionary', function(done) {
        let main = new Main()
        main.addContainer('user', User.Container)
        main.on('makedDictionary', (self, context, dictionary) => {
            expect(main.instanceof('user', 'user', dictionary)).to.equal(true)
            done()
        })
        main.makeDictionary('user', 'user')
    })
    it('registeredStatus', function(done) {
        let main = new Main()
        main.on('registeredStatus', (self, context, status) => {
            expect(!!status.reset).to.equal(true)
            done()
        })
        main.registerStatus('', {
            states: {}
        })
    })
    it('off', function() {
        let v = 0
        let main = new Main()
        main.addContainer('user', User.Container)
        let id = main.on('makedModel', (self, context, model) => {
            v += 1
        })
        main.make('user', 'user')
        main.make('user', 'user')
        main.off('makedModel', id)
        main.make('user', 'user')
        expect(v).to.equal(2)
    })
})
