import test from 'ava'
import trans from '../src/index'

test('basic', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {
        'hello': '안녕하세요',
        'bye': '잘가'
      }
    }
  })

  t.is(lang.trans('hello'), '안녕하세요')
  t.is(lang.trans('bye'), '잘가')
})

test('replace var', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {
        'hello': '안녕하세요, {name}님',
        'bye': '잘가, { name }야' // space
      }
    }
  })

  t.is(lang.trans('hello', {name: '철수'}), '안녕하세요, 철수님')
  t.is(lang.trans('bye', {name: '영희'}), '잘가, 영희야')
})

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
