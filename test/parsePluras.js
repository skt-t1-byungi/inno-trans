const test = require('ava')
const parse = require('../lib/parsePlurals').default

test('no plurals', t => {
    t.is(parse('abc').length, 0)
    t.is(parse('abc\\|sss').length, 0)
})
