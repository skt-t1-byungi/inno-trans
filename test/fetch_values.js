import test from 'ava'
import trans from '../src/index'

test('basic', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {
        'hello': '안녕하세요, {name}님',
        'bye': '잘가, { name }야' // with space
      }
    }
  })

  t.is(lang.trans('hello', { name: '철수' }), '안녕하세요, 철수님')
  t.is(lang.trans('bye', { name: '영희' }), '잘가, 영희야')
})

test('basic', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: {
        'hello': '안녕하세요, {name}님. {name}님께서는 오늘 {todo}를 하셨나요?'
      }
    }
  })

  t.is(lang.trans('hello', { name: '철수', todo: '숙제' }), '안녕하세요, 철수님. 철수님께서는 오늘 숙제를 하셨나요?')
})
