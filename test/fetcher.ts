import test from 'ava'
import makeFetcher from '../src/makeFetcher'
import { ValueFilterMap } from '../src/types'

const fetch = makeFetcher('{', '}')
const filters: ValueFilterMap = {
    repeat: str => String(str).repeat(2),
    test : str => String(str).slice(1, -1)
}

test('fetch values', t => {
    const m = (str: string, values: {}) => fetch(str, values, {}, [])

    t.is(m('abc {val}', { val: 123 }), 'abc 123')
    t.is(m('abc {val} }{', { val: 'test' }), 'abc test }{')
    t.is(m('abc { a},{ b },{c } def {d}', { a: 1, c: 3 , b: 2 }), 'abc 1,2,3 def ')
    t.is(m('abc \\{val} def', { val: 123 }), 'abc {val} def')
})

test('filter', t => {
    const m = (str: string, values: {}) => fetch(str, values, filters, [])

    t.is(m('abc {val|test} def', { val: 123 }), 'abc 2 def')
    t.is(m('abc {val |repeat } def', { val: 123 }), 'abc 123123 def')
    t.is(m('abc {val | test} def', { val: 123 }), 'abc 2 def')
    t.is(m('abc {val |test } def', { val: 123 }), 'abc 2 def')
    t.is(m('abc {val | test |test|test} def', { val: '1234567' }), 'abc 4 def')
    t.is(m('abc {val |test|repeat } def', { val: 123 }), 'abc 22 def')
    t.is(m('abc {val |repeat|test } def', { val: 123 }), 'abc 2312 def')
})

test('other tag - <?= key => ',t => {
    const fetch = makeFetcher('<?=', '=>')
    const m = (str: string, values: {}) => fetch(str, values, filters, [])

    t.is(m('abc <?=val=>', { val: 'def' }), 'abc def')
    t.is(m('abc <?=val| repeat=>', { val: 'def' }), 'abc defdef')

    const str = m('abc <?= a => gh <?== b => ijk <?= c ===>', { a: 'def', b: '~', c: '~' })
    t.is(str, 'abc def gh <?== b => ijk <?= c ===>')
})
