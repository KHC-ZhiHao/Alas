import { expect } from 'chai'
import Base from '../core/base'
import GetSet from '../core/get-set'
import Index from '../core/index'

describe('Index', () => {
    it('export test', function() {
        let alas = new Index()
        expect(!!alas.addContainer).to.equal(true)
    })
    it('get set', function() {
        let target = {
            name: '123'
        }
        let result = GetSet(target, {
            get(target, key) {
                return target[key]
            },
            set(target, key, value) {
                target[key] = value + '5'
            }
        }, false)
        expect(result.name).to.equal('123')
        result.name = '1234'
        expect(result.name).to.equal('12345')
    })
    it('system error', function() {
        let base = new Base('Test')
        expect(() => base.$devError('Test', 'Test')).to.throw(Error)
    })
    it('onDevError', function(done) {
        let base = new Base('MyBase')
        let ended = false
        Base.onDevError(context => {
            if (ended === false) {
                expect(context.name).to.equal('MyBase')
                expect(context.message).to.equal('Message')
                expect(context.functionName).to.equal('Test')
                ended = true
                done()
            }
        })
        expect(() => base.$devError('Test', 'Message')).to.throw(Error)
    })
})
