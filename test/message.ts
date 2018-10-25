import test from 'ava'
import Message from '../src/Message'

const m = (text: string) => new Message(text)

test('template', t => {
    t.is(m('abc').template(), 'abc')
})

test('findPluralTemplate - not', t => {
    t.falsy(m('abc').findPluralTemplate(1))
    t.falsy(m('abc\\|def').findPluralTemplate(1))
})

test('findPluralTemplate - index type', t => {
    let msg = m('abc|def')
    t.is(msg.findPluralTemplate(-1), 'abc')
    t.is(msg.findPluralTemplate(0), 'abc')
    t.is(msg.findPluralTemplate(1), 'abc')
    t.is(msg.findPluralTemplate(2), 'def')
    t.is(msg.findPluralTemplate(3), 'def')
    t.is(msg.findPluralTemplate(10), 'def')

    msg = m('abc|def|efg|123')
    t.is(msg.findPluralTemplate(-1), 'abc')
    t.is(msg.findPluralTemplate(0), 'abc')
    t.is(msg.findPluralTemplate(1), 'abc')
    t.is(msg.findPluralTemplate(2), 'def')
    t.is(msg.findPluralTemplate(3), 'efg')
    t.is(msg.findPluralTemplate(4), '123')
    t.is(msg.findPluralTemplate(10), '123')

    msg = m('abc|{test}def')
    t.is(msg.findPluralTemplate(1), 'abc')
    t.is(msg.findPluralTemplate(2), '{test}def')
})

test('findPluralTemplate - equal type', t => {
    const msg = m('{0}abc|{2}def')
    t.falsy(msg.findPluralTemplate(-1))
    t.is(msg.findPluralTemplate(0), 'abc')
    t.falsy(msg.findPluralTemplate(1))
    t.is(msg.findPluralTemplate(2), 'def')
    t.falsy(msg.findPluralTemplate(3))
})

test('findPluralTemplate - between type', t => {
    let msg = m('{0}abc|{2}def')
    t.falsy(msg.findPluralTemplate(-1))
    t.is(msg.findPluralTemplate(0), 'abc')
    t.falsy(msg.findPluralTemplate(1))
    t.is(msg.findPluralTemplate(2), 'def')
    t.falsy(msg.findPluralTemplate(3))

    msg = m('{1}abc|def|{2}123|456')
    t.falsy(msg.findPluralTemplate(-1))
    t.falsy(msg.findPluralTemplate(0))
    t.is(msg.findPluralTemplate(1), 'abc')
    t.is(msg.findPluralTemplate(2), 'def')
    t.falsy(msg.findPluralTemplate(3))
    t.is(msg.findPluralTemplate(4), '456')
})

test('findPluralTemplate - complex', t => {
    const msg = m('[-*, 2]abc|{3}def|[4,10]123|456')
    t.is(msg.findPluralTemplate(-5), 'abc')
    t.is(msg.findPluralTemplate(0), 'abc')
    t.is(msg.findPluralTemplate(2), 'abc')
    t.is(msg.findPluralTemplate(3), 'def')
    t.is(msg.findPluralTemplate(4), '123')
    t.is(msg.findPluralTemplate(10), '123')
    t.is(msg.findPluralTemplate(11), '456')
})
