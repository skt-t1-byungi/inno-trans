import test from 'ava'
import trans from '../src'

test('fallback', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {'bye': '굿바이'},
      en: { 'hello': 'hello, {name} sir' }
    },
    fallback: ['en']
  })

  t.is(lang.trans('bye'), '굿바이')
  t.is(lang.trans('hello', { name: '철수' }), 'hello, 철수 sir')
})

test('fallback (3step)', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {'bye': '굿바이'},
      en: {'hello': 'hello, {name} sir'},
      jp: {'sorry': '스미마셍'}
    },
    fallback: ['en']
  })

  t.is(lang.trans('bye'), '굿바이')
  t.is(lang.trans('hello', { name: '철수' }), 'hello, 철수 sir')
  t.is(lang.trans('sorry'), 'sorry')
})

test('add fallback', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {},
      en: { 'hello': 'hello, {name} sir' }
    }
  })

  t.is(lang.trans('hello', { name: '철수' }), 'hello')

  lang.fallback('en')
  t.is(lang.trans('hello', { name: '철수' }), 'hello, 철수 sir')
})
