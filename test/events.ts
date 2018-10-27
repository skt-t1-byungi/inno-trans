import test from 'ava'
import Translator from '../src/Translator'

const messages = { a: '' }

test('load - first, set message', t => {
    const trans = new Translator()
    trans.message('ko', messages)
    trans.once('load', () => t.pass())
    trans.locale('ko')
})

test('load - first, set locale', t => {
    const trans = new Translator()
    trans.locale('ko')
    trans.once('load', () => t.pass())
    trans.message('ko', messages)
})

test('add listener after loaded ', t => {
    const trans = new Translator()
    trans.locale('ko')
    trans.message('ko', messages)
    trans.once('load', () => t.pass())
})

test('change', t => {
    const trans = new Translator()
    trans.locale('ko')
    trans.message('ko', messages)
    trans.locale('en')
    trans.once('change', l => t.is(l, 'en'))
    trans.message('en', messages)
})

test('prevent change evt twice - add message', t => {
    const trans = new Translator()
    trans.locale('ko')
    trans.message('ko', messages)
    trans.once('change', () => t.fail())
    trans.message('ko', messages)
    t.pass()
})

test('prevent change evt twice - set same locale', t => {
    t.plan(1)
    const trans = new Translator()
    trans.locale('ko')
    trans.message('ko', messages)
    trans.message('en', messages)
    trans.on('change', () => t.pass())
    trans.locale('en')
    trans.locale('en')
})

test('add, remove', t => {
    t.plan(2)
    const trans = new Translator()
    trans.once('add', l => t.is(l, 'ko'))
    trans.message('ko', messages)
    trans.once('remove', l => t.deepEqual(l, ['ko']))
    trans.removeMessage('ko')
})
