import { expect } from 'chai'
import Main from '../core/main'
import * as User from './fake/user'

function getDictionary() {
    let main = new Main<{ user: User.Structure }>()
    // @ts-ignore
    main.addContainer('user', User.Container)
    return main.makeDictionary('user', 'user')
}

describe('Base', () => {
    it('size', function() {
        let dict = getDictionary()
        expect(dict.size).to.equal(0)
        dict.write({
            dave: {
                Name: 'dave'
            }
        })
        expect(dict.size).to.equal(1)
    })
    it('isChange', function() {
        let dict = getDictionary()
        expect(dict.isChange()).to.equal(false)
        dict.write({
            dave: {
                Name: 'dave'
            }
        })
        expect(dict.isChange()).to.equal(true)
    })
    it('clear event', function(done) {
        let dict = getDictionary()
        dict.on('$clear', () => {
            expect(dict.size).to.equal(0)
            done()
        })
        dict.write({
            dave: {
                Name: 'dave'
            }
        })
        dict.clear()
    })
    it('validate', function() {
        let dict = getDictionary()
        expect(dict.validate().success).to.equal(true)
        dict.write({
            dave: {
                Name: 'dave'
            }
        })
        expect(dict.validate().success).to.equal(true)
        let model = dict.get('dave')
        if (model) {
            // @ts-ignore
            model.name = undefined
        }
        expect(dict.validate().success).to.equal(false)
    })
    it('dirty', function() {
        let dict = getDictionary()
        expect(dict.dirty).to.equal(false)
        dict.write({
            dave: {
                Name: 'dave'
            }
        })
        expect(dict.dirty).to.equal(true)
    })
    it('bodys', function() {
        let dict = getDictionary()
        expect(dict.bodys()).to.eql({})
        dict.write({
            dave: {
                Name: 'dave'
            }
        })
        expect(dict.bodys().dave.name).to.eql('dave')
    })
    it('exports', function() {
        let dict = getDictionary()
        expect(dict.exports()).to.eql({})
        dict.write({
            dave: {
                Name: 'dave'
            }
        })
        expect(dict.exports().dave.Name).to.eql('dave')
    })
    it('has', function() {
        let dict = getDictionary()
        expect(dict.has('dave')).to.equal(false)
        dict.write({
            dave: {
                Name: 'dave'
            }
        })
        expect(dict.has('dave')).to.equal(true)
    })
    it('remove', function() {
        let dict = getDictionary()
        expect(dict.has('dave')).to.equal(false)
        dict.write({
            dave: {
                Name: 'dave'
            }
        })
        expect(dict.has('dave')).to.equal(true)
        dict.remove('dave')
        expect(dict.has('dave')).to.equal(false)
    })
    it('clear', function() {
        let dict = getDictionary()
        expect(dict.has('dave')).to.equal(false)
        dict.write({
            dave: {
                Name: 'dave'
            }
        })
        expect(dict.has('dave')).to.equal(true)
        dict.clear()
        expect(dict.dirty).to.equal(false)
        expect(dict.has('dave')).to.equal(false)
    })

    it('in model', function() {
        let user = {
            body: {
                name: []
            },
            refs: {
                attr: '{attr}'
            }
        }
        let attr = {
            body: {
                value: []
            }
        }
        let main = new Main()
        main.addContainer('user', {
            // @ts-ignore
            models: { user, attr }
        })
        let userModel = main.make('user', 'user')
        userModel.$init({
            name: 'dave',
            attr: {
                addr: {
                    value: '測試'
                },
                phone: {
                    value: 10
                }
            }
        })
        // @ts-ignore
        expect(userModel.attr.get('addr').value).to.equal('測試')
        // @ts-ignore
        expect(userModel.attr.get('phone').value).to.equal(10)
        expect(userModel.$export()).to.eql({
            name: 'dave',
            attr: {
                addr: {
                    value: '測試'
                },
                phone: {
                    value: 10
                }
            }
        })
        expect(userModel.$isChange()).to.equal(false)
        // @ts-ignore
        userModel.attr.get('addr').value = 456
        expect(userModel.$isChange()).to.equal(true)
    })
})
