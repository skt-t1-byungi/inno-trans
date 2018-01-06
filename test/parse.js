import test from 'ava'
import parse from '../src/parser'

test('basic', t => {
  t.deepEqual(
    parse('hello'),
    { value: 'hello', plural: [] }
  )
})

test('one|many', t => {
  t.deepEqual(
    parse('one|many'),
    {
      value: 'one|many',
      plural: [
        { min: -Infinity, max: 1, value: 'one' },
        { min: 2, max: Infinity, value: 'many' }
      ]
    })
})

test('one|two|...', t => {
  t.deepEqual(
    parse('one|two|3|4|5'),
    {
      value: 'one|two|3|4|5',
      plural: [
        { min: -Infinity, max: 1, value: 'one' },
        { min: 2, max: 2, value: 'two' },
        { min: 3, max: 3, value: '3' },
        { min: 4, max: 4, value: '4' },
        { min: 5, max: Infinity, value: '5' }
      ]
    }
  )
})

test('plural("{}") expression', t => {
  t.deepEqual(
    parse('one|{2}two'),
    {
      value: 'one|{2}two',
      plural: [
        { min: -Infinity, max: 1, value: 'one' },
        { min: 2, max: 2, value: 'two' }
      ]
    })

  t.deepEqual(
    parse('{3}one|two|three|{10}4'),
    {
      value: '{3}one|two|three|{10}4',
      plural: [
        { min: 3, max: 3, value: 'one' },
        { min: 2, max: 2, value: 'two' },
        { min: 3, max: 3, value: 'three' },
        { min: 10, max: 10, value: '4' }
      ]
    })
})

test('plural("[]") expression', t => {
  t.deepEqual(
    parse('one|[2,5]two'),
    {
      value: 'one|[2,5]two',
      plural: [
        { min: -Infinity, max: 1, value: 'one' },
        { min: 2, max: 5, value: 'two' }
      ]
    })

  t.deepEqual(
    parse('one|[2,5]two|[1,*]3|4'),
    {
      value: 'one|[2,5]two|[1,*]3|4',
      plural: [
        { min: -Infinity, max: 1, value: 'one' },
        { min: 2, max: 5, value: 'two' },
        { min: 1, max: Infinity, value: '3' },
        { min: 4, max: Infinity, value: '4' }
      ]
    })
})

test('complex', t => {
  t.deepEqual(
    parse('{0}one|[2,5]two|[1,*]3|4'),
    {
      value: '{0}one|[2,5]two|[1,*]3|4',
      plural: [
        { min: 0, max: 0, value: 'one' },
        { min: 2, max: 5, value: 'two' },
        { min: 1, max: Infinity, value: '3' },
        { min: 4, max: Infinity, value: '4' }
      ]
    })
})

test('|| -> |', t => {
  t.deepEqual(
    parse('{0}one||tail||tail|||3'),
    {
      value: '{0}one||tail||tail|||3',
      plural: [
        { min: 0, max: 0, value: 'one|tail|tail|' },
        { min: 2, max: Infinity, value: '3' }
      ]
    })
})
