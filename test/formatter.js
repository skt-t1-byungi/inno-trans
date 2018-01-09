import test from 'ava'
import trans from '../src/index'

test('basic', t => {
  let captureValues = null
  let captureLocale = null

  const formatter = (message, values, locale) => {
    captureValues = values
    captureLocale = locale
    return '!!' + message + '!!'
  }

  const lang = trans({
    locale: 'ko',
    formatter: [formatter],
    message: {
      ko: {
        'hello': '안녕 {name}'
      }
    }
  })

  const values = {name: '철수'}
  t.is(lang.trans('hello', values), '!!안녕 철수!!')
  t.deepEqual(captureValues, values)
  t.is(captureLocale, 'ko')
})

test('add formatter', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {
        'hello': '안녕'
      }
    }
  })

  t.is(lang.trans('hello'), '안녕')

  lang.formatter((message, values, locale) => '!!' + message + '!!')
  t.is(lang.trans('hello'), '!!안녕!!')
})
