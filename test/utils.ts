import { expect } from 'chai'
import * as User from './fake/user'
import Main from '../core/main'

describe('Utils', () => {

    it('generateId', function() {
        let id = Main.utils.generateId()
        expect(id).to.be.a('string')
    })

    it('Is Model', function() {
        let alas = new Main()
        alas.addContainer('test', {
            models: {
                test: {}
            }
        })
        let model = alas.make('test', 'test')
        expect(Main.utils.isModel(model)).to.equal(true)
    })

    it('Is Model Error', function() {
        expect(Main.utils.isModel('123')).to.equal(false)
    })

    it('Is List', function() {
        let alas = new Main()
        alas.addContainer('test', {
            models: {
                test: {}
            }
        })
        let list = alas.makeList('test', 'test')
        expect(Main.utils.isList(list)).to.equal(true)
    })

    it('Is List Error', function() {
        expect(Main.utils.isList('123')).to.equal(false)
    })

    it('JPJS', function() {
        let b = {
            a: 5
        }
        let c = Main.utils.jpjs(b)
        c.a = 10
        expect(b.a).to.equal(5)
        expect(c.a).to.equal(10)
    })

    it('getType', function() {
        expect(Main.utils.getType('')).to.equal('string')
        expect(Main.utils.getType(true)).to.equal('boolean')
        expect(Main.utils.getType([])).to.equal('array')
        expect(Main.utils.getType(null)).to.equal('empty')
        expect(Main.utils.getType(undefined)).to.equal('empty')
        expect(Main.utils.getType({})).to.equal('object')
        expect(Main.utils.getType(/www/)).to.equal('regexp')
        expect(Main.utils.getType(new Error())).to.equal('error')
        expect(Main.utils.getType(Buffer.from([]))).to.equal('buffer')
        expect(Main.utils.getType(Number('AAAA'))).to.equal('NaN')
        expect(Main.utils.getType(Promise.resolve())).to.equal('promise')
    })

    it('verify', function() {
        let options = {
            a: 5,
            b: '7'
        }
        let reslut = Main.utils.verify(options, {
            a: [true, ['number']],
            b: [true, ['string']]
        })
        expect(reslut.a).to.equal(5)
        expect(reslut.b).to.equal('7')
        expect(() => {
            Main.utils.verify(options, {
                a: [true, ['number']],
                b: [true, ['string']],
                c: [true, ['string']]
            })
        }).to.throw(Error)
        expect(() => {
            Main.utils.verify(options, {
                a: [123, ['number']]
            })
        }).to.throw(Error)
        expect(() => {
            Main.utils.verify(options, {
                a: [true, 123]
            })
        }).to.throw(Error)
        expect(() => {
            Main.utils.verify(options, {
                a: [true, ['string']]
            })
        }).to.throw(Error)
    })

    it('verify no data key', function() {
        let options = {
            a: 5,
            b: '7',
            c: 10
        }
        let reslut = Main.utils.verify(options, {
            a: [true, ['number']],
            b: [true, ['string']]
        })
        expect(reslut.c).to.equal(10)
    })

    it('peel', function() {
        let test = {
            a: {
                c: 5
            }
        }
        expect(Main.utils.peel(test, 'a.c')).to.equal(5)
        expect(Main.utils.peel(test, 'a.b.e.e')).to.equal(undefined)
        expect(Main.utils.peel(test, 'a.b.e.e', '*')).to.equal('*')
    })

    it('mapping', function() {
        let keyMap = {
            a: 'A',
            b: 'B'
        }
        let target = {
            A: 5,
            B: 3
        }
        let target2 = {
            a: 5,
            b: 3
        }
        expect(Main.utils.mapping(keyMap, target)).to.eql({
            a: 5,
            b: 3
        })
        expect(Main.utils.mapping(keyMap, target2, true)).to.eql({
            A: 5,
            B: 3
        })
    })

    it('mapping by model', function() {
        let keyMap = {
            name: 'Name',
            children: 'Children',
            attributes: 'Attributes'
        }
        let alas = new Main()
        // @ts-ignore
        alas.addContainer('fake', User.Container)
        let model = alas.make('fake', 'user').$init({
            Name: '123',
            Children: [
                {
                    Name: '456',
                    Attributes: {
                        Sex: 'man',
                        Phone: 'AAA'
                    }
                }
            ]
        })
        let output = Main.utils.mapping(keyMap, model, true)
        expect(output).to.eql({
            Name: '123',
            Children: [
                {
                    Name: '456',
                    Children: [],
                    Attributes: {
                        Phone: 'AAA'
                    }
                }
            ],
            Attributes: {
                Phone: null
            }
        })
    })

    it('value to', function() {
        let test = {
            a: 5
        }
        let output = Main.utils.valueTo(test, () => 456)
        expect(test.a).to.equal(5)
        expect(output.a).to.equal(456)
    })
})
