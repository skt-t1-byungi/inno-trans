import test from 'ava'
import trans from '../src'

test('basic', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: { 'test': 'one|two' }
    }
  })

  t.is(lang.transChoice('test', 0), 'one')
  t.is(lang.transChoice('test', 1), 'one')
  t.is(lang.transChoice('test', 2), 'two')
  t.is(lang.transChoice('test', 10), 'two')
})

test('fetch values', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: { 'test': 'one {item}|two {item}' }
    }
  })

  const values = {item: 'test'}

  t.is(lang.transChoice('test', 0, values), 'one test')
  t.is(lang.transChoice('test', 1, values), 'one test')
  t.is(lang.transChoice('test', 2, values), 'two test')
  t.is(lang.transChoice('test', 10, values), 'two test')
})

test('complex', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: { 'test': '{0}zero|{ 1}one|[2, 3]two more|[4 ,* ]many' }
    }
  })

  t.is(lang.transChoice('test', 0), 'zero')
  t.is(lang.transChoice('test', 1), 'one')
  t.is(lang.transChoice('test', 2), 'two more')
  t.is(lang.transChoice('test', 3), 'two more')
  t.is(lang.transChoice('test', 4), 'many')
  t.is(lang.transChoice('test', 10), 'many')
})

test('unodered complex', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: { 'test': '{3}3|{0}zero|[2,10]2~10|[4,*]many' }
    }
  })

  t.is(lang.transChoice('test', 0), 'zero')
  t.is(lang.transChoice('test', 1), 'test') // not exists -> key
  t.is(lang.transChoice('test', 2), '2~10')
  t.is(lang.transChoice('test', 3), '3')
  t.is(lang.transChoice('test', 4), '2~10')
  t.is(lang.transChoice('test', 10), '2~10')
  t.is(lang.transChoice('test', 11), 'many')
})

test('nonsense', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: { 'test': '0|{0}???|[2,3]2~3|[*,-1]many' }
    }
  })

  t.is(lang.transChoice('test', 0), '0')
  t.is(lang.transChoice('test', 1), '0') // not exists -> key
  t.is(lang.transChoice('test', 2), '2~3')
  t.is(lang.transChoice('test', 3), '2~3')
  t.is(lang.transChoice('test', 4), 'test')
  t.is(lang.transChoice('test', 10), 'test')
  t.is(lang.transChoice('test', 11), 'test')
})

test('typo', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {
        'test': '{{0}0|{2}2'
      }
    }
  })

  t.is(lang.transChoice('test', 0), '{{0}0')
  t.is(lang.transChoice('test', 1), '{{0}0')
  t.is(lang.transChoice('test', 2), '2')
})

test('none choice', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {
        'test': 'one'
      }
    }
  })

  t.is(lang.transChoice('test', 0), 'test')
})
