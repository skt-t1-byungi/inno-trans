const test = require('ava')
const Message = require('../lib/Message').default

const m = text => new Message(text)

test('template()', t => {
    t.is(m('abc').template(), 'abc')
})
