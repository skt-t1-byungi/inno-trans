import test from 'ava'
import parse from '../src/parsePlurals'

test('no plurals', t => {
    t.is(parse('abc').length, 0)
    t.is(parse('abc\\|sss').length, 0)
})

test('index type', t => {
    t.deepEqual(parse('abc|def'), [
        { value: 'abc', min: -Infinity, max: 1 },
        { value: 'def', min: 2, max: Infinity }
    ])

    t.deepEqual(parse('abc|def|123'), [
        { value: 'abc', min: -Infinity, max: 1 },
        { value: 'def', min: 2, max: 2 },
        { value: '123', min: 3, max: Infinity }
    ])
})

test('equal type', t => {
    t.deepEqual(parse('{0}abc|{2}def'), [
        { value: 'abc', min: 0, max: 0 },
        { value: 'def', min: 2, max: 2 }
    ])

    t.deepEqual(parse('{1}abc|def|{2}123|456'), [
        { value: 'abc', min: 1, max: 1 },
        { value: 'def', min: 2, max: 2 },
        { value: '123', min: 2, max: 2 },
        { value: '456', min: 4, max: Infinity }
    ])
})

test('between type', t => {
    t.deepEqual(parse('[1,3]abc|[1,*]def'), [
        { value: 'abc', min: 1, max: 3 },
        { value: 'def', min: 1, max: Infinity }
    ])

    t.deepEqual(parse('abc|[-*, 2]def|[2,10]123|456'), [
        { value: 'abc', min: -Infinity, max: 1 },
        { value: 'def', min: -Infinity, max: 2 },
        { value: '123', min: 2, max: 10 },
        { value: '456', min: 4, max: Infinity }
    ])
})

test('complex', t => {
    t.deepEqual(parse('[-*, 2]abc|{3}def|[4,10]123|456'), [
        { value: 'abc', min: -Infinity, max: 2 },
        { value: 'def', min: 3, max: 3 },
        { value: '123', min: 4, max: 10 },
        { value: '456', min: 4, max: Infinity }
    ])
})
