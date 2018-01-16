import test from 'ava'
import trans from '../src/index'

test('no locale', t => {
  t.throws(() => {
    trans({
      message: {
        ko: { 'hello': '안녕하세요' }
      }
    })
  })

  t.throws(() => {
    trans({
      locale: 'en',
      message: {
        ko: { 'hello': '안녕하세요' }
      }
    })
  })
})

test('invalid message', t => {
  t.throws(() => {
    trans({
      locale: 'ko',
      message: {
        ko: { test: undefined }
      }
    })
  }) 
})
