import test from 'ava'
import trans from '../src/index'

test('fallback', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {},
      en: { 'hello': 'hello, {name} sir' }
    },
    fallback: ['en']
  })

  t.is(lang.trans('hello', { name: '철수' }), 'hello, 철수 sir')
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
