const test = require('ava')
const Translator = require('../lib/Translator').default

test('load - first, set message', t => {
    const trans = new Translator()
    trans.message('ko', {})
    trans.once('load', () => t.pass())
    trans.locale('ko')
})

test('load - first, set locale', t => {
    const trans = new Translator()
    trans.locale('ko')
    trans.once('load', () => t.pass())
    trans.message('ko', {})
})

test('add listener after loaded ', t => {
    const trans = new Translator()
    trans.locale('ko')
    trans.message('ko', {})
    trans.once('load', () => t.pass())
})

test('change', t => {
    const trans = new Translator()
    trans.locale('ko')
    trans.message('ko', {})
    trans.locale('en')
    trans.once('change', l => t.is(l, 'en'))
    trans.message('en', {})
})

test('add, remove', t => {
    t.plan(2)
    const trans = new Translator()
    trans.once('add', l => t.is(l, 'ko'))
    trans.message('ko', {})
    trans.once('remove', l => t.deepEqual(l, ['ko']))
    trans.removeMessage('ko')
})
