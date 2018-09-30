const test = require('ava')
const makeFetcher = require('../lib/makeFetcher').default

const fetch = makeFetcher('{', '}')

test('fetch values', t => {
    t.is(fetch('abc {val}', { val: 123 }), 'abc 123')
    t.is(fetch('abc {val} }{', { val: 'test' }), 'abc test }{')
    t.is(fetch('abc { a},{ b },{c } def {d}', { a: 1, b: 2, c: 3 }), 'abc 1,2,3 def ')

    // todo
    // t.is(fetch('abc \\{val}', { val: 123 }), 'abc {val}')
})
