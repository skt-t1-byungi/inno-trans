import test from 'ava'
import trans from '../src/index'

test('basic', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {
        'hello': '안녕하세요'
      }
    }
  })

  t.is(lang.trans('hello', '안녕하세요'), '안녕하세요')
})
