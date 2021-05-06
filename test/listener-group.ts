import { expect } from 'chai'
import * as User from './fake/user'
import Main from '../core/main'

function getCore() {
    let main = new Main<{
        user: User.Structure
    }>()
    // @ts-ignore
    main.addContainer('user', User.Container)
    return main
}

describe('Listener Group', () => {
    it('basic', function() {
        let lg = new Main.ListenerGroup()
        let alas = getCore()
        let count = 0
        lg.add(alas, 'makedModel', (self, ctx, model) => {
            expect(alas.utils.isModel(model)).to.equal(true)
            count += 1
        })
        alas.make('user', 'user')
        alas.make('user', 'user')
        expect(count).to.equal(2)
        lg.close()
        alas.make('user', 'user')
        expect(count).to.equal(2)
    })
    it('model', function(done) {
        let lg = new Main.ListenerGroup()
        let alas = getCore()
        let model = alas.make('user', 'user')
        lg.add(model, '$ready', (self, ctx) => {
            expect(model.name).to.equal('dave')
            done()
        })
        model.$init({
            Name: 'dave'
        })
    })
    it('model close', function() {
        let lg = new Main.ListenerGroup()
        let alas = getCore()
        let count = 0
        let model = alas.make('user', 'user')
        lg.add(model, '$ready', (self, ctx) => {
            count += 1
        })
        lg.close()
        model.$init({
            Name: 'dave'
        })
        expect(count).to.equal(0)
    })
})
