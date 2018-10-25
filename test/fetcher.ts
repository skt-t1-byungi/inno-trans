import test from 'ava'
import makeFetcher from '../src/makeFetcher'

const fetch = makeFetcher('{', '}')

test('fetch values', t => {
    const m = (str: string, values: {}) => fetch(str, values, {})

    t.is(m('abc {val}', { val: 123 }), 'abc 123')
    t.is(m('abc {val} }{', { val: 'test' }), 'abc test }{')
    t.is(m('abc { a},{ b },{c } def {d}', { a: 1, b: 2, c: 3 }), 'abc 1,2,3 def ')
    t.is(m('abc \\{val} def', { val: 123 }), 'abc {val} def')
})
