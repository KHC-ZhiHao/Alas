import { expect } from 'chai'
import Main from '../core/main'
import * as User from './fake/user'

function getList() {
    let main = new Main<{
        user: User.Structure
    }>()
    // @ts-ignore
    main.addContainer('user', User.Container)
    return main.makeList('user', 'user')
}

describe('List', () => {
    it('size', function() {
        let list = getList()
        expect(list.size).to.equal(0)
        list.write({
            Name: 'dave'
        })
        expect(list.size).to.equal(1)
    })

    it('remove with foreach', function() {
        let list = getList()
        list.write({ Name: 'dave' })
        list.write({ Name: 'james' })
        list.forEach((user, index) => {
            if (index === 0) {
                expect(user.name).to.equal('dave')
            }
            if (index === 1) {
                expect(user.name).to.equal('james')
            }
            list.removeByItem(user)
        })
    })

    it('no save', function() {
        let main = new Main()
        // @ts-ignore
        main.addContainer('user', User.Container)
        let list = main.makeList('user', 'user', { save: false })
        list.write({
            Name: 'dave'
        })
        expect(() => {
            list.items[0].isChange()
        }).to.throw(Error)
    })

    it('items', function() {
        let list = getList()
        list.write({
            Name: 'dave'
        })
        expect(list.items[0].name).to.equal('dave')
    })

    it('dirty', function() {
        let list = getList()
        expect(list.dirty).to.equal(false)
        list.write({
            Name: 'dave'
        })
        expect(list.dirty).to.equal(true)
        list.setDirty(false)
        expect(list.dirty).to.equal(false)
    })

    it('views', function() {
        let list = getList()
        expect(list.v.size).to.equal(0)
        list.write({
            Name: 'dave'
        })
        expect(list.v.size).to.equal(1)
    })

    it('methods', function() {
        let list = getList()
        expect(list.m.getSize(1)).to.equal(1)
        list.write({
            Name: 'dave'
        })
        expect(list.m.getSize(1)).to.equal(2)
    })

    it('loaders', function(done) {
        let list = getList()
        expect(list.o.getSize.called).to.equal(false)
        list.write({
            Name: 'dave'
        })
        list.o.getSize.start('size: ').then((value: any) => {
            expect(value).to.equal('size: 1')
            expect(list.o.getSize.done).to.equal(true)
            expect(list.o.getSize.called).to.equal(true)
            expect(!!list.loader.loading).to.equal(false)
            expect(list.o.getSize.loading).to.equal(false)
            done()
        })
        expect(list.o.getSize.called).to.equal(true)
        expect(list.o.getSize.loading).to.equal(true)
        expect(!!list.loader.loading).to.equal(true)
        expect(list.o.getSize.done).to.equal(false)
    })

    it('loaders error', function(done) {
        let list = getList()
        list.write({
            Name: 'dave'
        })
        expect(list.loader.error).to.equal(null)
        expect(list.o.getError.error).to.equal(null)
        list.o.getError.start('size: ')
            .catch((value: any) => {
                expect(value).to.equal('size: 1')
                expect(list.o.getError.error).to.equal('size: 1')
                expect(list.loader.error).to.eql({
                    key: 'getError',
                    value: 'size: 1'
                })
                done()
            })
    })

    it('config', function() {
        let list = getList()
        expect(list.config.test).to.equal('test')
    })

    it('utils', function() {
        let list = getList()
        expect(list.utils.generateId()).to.be.a('string')
    })

    it('no write', function() {
        let main = new Main()
        main.addContainer('user', {
            models: {
                user: {}
            }
        })
        let list = main.makeList('user', 'user')
        list.write({})
        expect(list.size).to.equal(1)
    })

    it('writeAfter', function() {
        let list = getList()
        list.write({
            Name: 'dave'
        })
        expect(list.items[0].$self.writeAfter).to.equal(true)
    })

    it('parent', function() {
        let list = getList()
        list.write({
            Name: 'dave',
            Children: [
                {
                    Name: 'stave'
                }
            ]
        })
        expect(list.items[0].$parent).to.equal(null)
        expect(list.items[0].children.parent).to.equal(list.items[0])
    })

    it('foreach', function() {
        let list = getList()
        let count = 0
        list.batchWrite([
            {
                Name: 'dave'
            },
            {
                Name: 'stave'
            }
        ])
        list.forEach((model, index) => {
            count += 1
            if (index === 0) {
                expect(model.name).to.equal('dave')
            }
            if (index === 1) {
                expect(model.name).to.equal('stave')
            }
        })
        expect(count).to.equal(2)
    })

    it('isChange', function() {
        let list = getList()
        expect(list.isChange()).to.equal(false)
        list.batchWrite([
            {
                Name: 'dave'
            },
            {
                Name: 'stave'
            }
        ])
        expect(list.isChange()).to.equal(true)
    })

    it('validate', function() {
        let list = getList()
        expect(list.validate().success).to.equal(true)
        list.batchWrite([
            {
                Name: 'dave'
            },
            {
                Name: 'stave'
            }
        ])
        expect(list.validate().success).to.equal(true)
        // @ts-ignore
        list.items[0].name = undefined
        expect(list.validate().success).to.equal(false)
        expect(list.validate().result[0].result.name).to.equal('Required')
    })

    it('has', function() {
        let list = getList()
        expect(list.has('1234')).to.equal(false)
        list.write({
            Name: 'dave'
        })
        // @ts-ignore
        expect(list.has(list.items[0].id || '')).to.equal(true)
    })

    it('fetch', function() {
        let list = getList()
        expect(list.fetch('1234')).to.equal(undefined)
        list.write({
            Name: 'dave'
        })
        // @ts-ignore
        expect(list.fetch(list.items[0].id || '')).to.equal(list.items[0])
    })

    it('batchWriteAsync', function(done) {
        let list = getList()
        list.on('$writeAsyncDone', (self) => {
            expect(self.size).to.equal(2)
            done()
        })
        list.batchWriteAsync([
            {
                Name: 'dave'
            },
            {
                Name: 'stave'
            }
        ])
    })

    it('remove', function() {
        let list = getList()
        list.write({
            Name: 'dave'
        })
        // @ts-ignore
        list.remove(list.items[0].id || '')
        expect(list.size).to.equal(0)
    })

    it('remove by items', function() {
        let list = getList()
        list.write({
            Name: 'dave'
        })
        let target = list.items[0]
        list.removeByItem(target)
        expect(list.size).to.equal(0)
    })

    it('clear', function() {
        let list = getList()
        list.write({
            Name: 'dave'
        })
        expect(list.dirty).to.equal(true)
        list.clear()
        expect(list.dirty).to.equal(false)
        expect(list.size).to.equal(0)
    })

    it('insert', function() {
        let list = getList()
        list.batchWrite([
            {
                Name: 'dave'
            },
            {
                Name: 'stave'
            }
        ])
        list.write({
            Name: 'sam'
        }, {
            insert: 1
        })
        expect(list.items[1].name).to.equal('sam')
    })
})

describe('Event', () => {

    it('on', function(done) {
        let list = getList()
        list.on('123', () => {
            done()
        })
        list.emit('123')
    })

    it('off', function(done) {
        let list = getList()
        let count = 0
        let id = list.on('test', (self, context) => {
            count += 1
            list.off('test', id)
            list.emit('test')
        })
        list.emit('test')
        setTimeout(() => {
            expect(count).to.equal(1)
            done()
        }, 20)
    })

    it('once', function(done) {
        let list = getList()
        let count = 0
        list.once('test', (self, context) => {
            count += 1
        })
        list.emit('test')
        list.emit('test')
        setTimeout(() => {
            expect(count).to.equal(1)
            done()
        }, 20)
    })

    it('writeSuccess', function(done) {
        let list = getList()
        list.on('$writeSuccess', () => done())
        list.write({
            Name: 'dave'
        })
    })

    it('remove', function(done) {
        let list = getList()
        list.on('$remove', () => done())
        list.write({
            Name: 'dave'
        })
        list.removeByItem(list.items[0])
    })

    it('writeReject', function(done) {
        let list = getList()
        list.on('$writeReject', (target, handler, { message }) => {
            expect(message).to.equal('error')
            done()
        })
        list.write({
            id: '9487'
        })
    })

    it('fetch', function(done) {
        let list = getList()
        list.on('$fetch', () => done())
        list.write({
            id: '123',
            Name: 'dave'
        })
        list.fetch('123')
    })

    it('fetchFail', function(done) {
        let list = getList()
        list.on('$fetchFail', () => done())
        list.write({
            id: '123',
            Name: 'dave'
        })
        list.fetch('456')
    })

})
