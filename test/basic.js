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

test('locale selection', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: { 'hello': '안녕하세요' },
      en: { 'hello': 'hello' }
    }
  })

  t.is(lang.trans('hello'), '안녕하세요')

  lang.locale('en')
  t.is(lang.trans('hello'), 'hello')
})

test('not exists message, replace with key', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: { 'hello': '안녕하세요' }
    }
  })

  t.is(lang.trans('not exists'), 'not exists')
})

test('fetch values', t => {
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

test('fetch values, repeat', t => {
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

test('change tag', t => {
  const lang = trans({
    locale: 'ko',
    tag: ['<%=', '%>'],
    message: {
      ko: {
        'hello': '안녕하세요, <%= name %>님. <%=name%>님께서는 오늘 <%=todo%>를 하셨나요?'
      }
    }
  })

  t.is(lang.trans('hello', { name: '철수', todo: '숙제' }), '안녕하세요, 철수님. 철수님께서는 오늘 숙제를 하셨나요?')
})

test('add messages', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: { 'test': '테스트' }
    }
  })

  t.is(lang.trans('test'), '테스트')
  t.is(lang.trans('add'), 'add')

  lang.message('ko', {add: '추가'})
  t.is(lang.trans('test'), '테스트')
  t.is(lang.trans('add'), '추가')
})
