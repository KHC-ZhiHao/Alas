import { expect } from 'chai'
import * as User from './fake/user'
import Main from '../core/main'
import { RuleArray } from '../core/types'

function validate(value: any, rules: RuleArray) {
    let main = new Main<{
        user: User.Structure
    }>()
    main.addContainer('user', User.Container)
    let model = main.make('user', 'user').$init({
        Name: '123'
    })
    return main._core.rule.validate(model, value, rules)
}

describe('Package', () => {
    it('alphanumeric', function() {
        expect(validate(1, ['#ms.alphanumeric'])).to.equal(true)
        expect(validate(1.1, ['#ms.alphanumeric'])).to.a('string')
    })
    it('email', function() {
        expect(validate('aaa@gmail.com', ['#ms.email'])).to.equal(true)
        expect(validate('aaa.gmail.com', ['#ms.email'])).to.a('string')
    })
    it('hhmm', function() {
        expect(validate('12:01', ['#ms.hhmm'])).to.equal(true)
        expect(validate('25:01', ['#ms.hhmm'])).to.a('string')
    })
    it('in', function() {
        expect(validate('10', ['#ms.in|of:10,20'])).to.equal(true)
        expect(validate('20', ['#ms.in|of:10,20'])).to.equal(true)
        expect(validate('30', ['#ms.in|of:10,20'])).to.a('string')
    })
    it('length', function() {
        expect(validate(new Array(1), ['#ms.length|max:1'])).to.equal(true)
        expect(validate(new Array(2), ['#ms.length|max:1'])).to.a('string')
        expect(validate(new Array(1), ['#ms.length|min:1'])).to.equal(true)
        expect(validate(new Array(0), ['#ms.length|min:1'])).to.a('string')
        expect(validate(new Array(1), ['#ms.length|same:1'])).to.equal(true)
        expect(validate(new Array(0), ['#ms.length|same:1'])).to.a('string')
        expect(validate(new Array(2), ['#ms.length|same:1'])).to.a('string')
    })
    it('mmdd', function() {
        expect(validate('12-01', ['#ms.mmdd'])).to.equal(true)
        expect(validate('13-01', ['#ms.mmdd'])).to.a('string')
    })
    it('number', function() {
        expect(validate(1, ['#ms.number'])).to.equal(true)
        expect(validate('1', ['#ms.number'])).to.equal(true)
        expect(validate('1a', ['#ms.number'])).to.a('string')
    })
    it('range', function() {
        expect(validate(5, ['#ms.range|max:10|min:1'])).to.equal(true)
        expect(validate(11, ['#ms.range|max:10|min:1'])).to.a('string')
        expect(validate(0, ['#ms.range|max:10|min:1'])).to.a('string')
        expect(validate(5, ['#ms.range|same:5'])).to.equal(true)
        expect(validate(5, ['#ms.range|same:10'])).to.a('string')
    })
    it('required', function() {
        expect(validate('1', ['#ms.required'])).to.equal(true)
        expect(validate('', ['#ms.required'])).to.a('string')
    })
    it('strongType', function() {
        expect(validate([], ['#ms.strongType|is:array'])).to.equal(true)
        expect(validate('', ['#ms.strongType|is:array'])).to.a('string')
    })
    it('type', function() {
        expect(validate('', ['#ms.type|is:string'])).to.equal(true)
        expect(validate(1, ['#ms.type|is:string'])).to.a('string')
    })
    it('yyyymm', function() {
        expect(validate('2012-01', ['#ms.yyyymm'])).to.equal(true)
        expect(validate('2012-13', ['#ms.yyyymm'])).to.a('string')
        expect(validate('2012-12-01', ['#ms.yyyymm'])).to.a('string')
    })
    it('yyyymmdd', function() {
        expect(validate('2012-01-01', ['#ms.yyyymmdd'])).to.equal(true)
        expect(validate('2012-13-01', ['#ms.yyyymmdd'])).to.a('string')
        expect(validate('2012-12', ['#ms.yyyymmdd'])).to.a('string')
    })
})
