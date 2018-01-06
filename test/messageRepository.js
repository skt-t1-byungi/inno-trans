import test from 'ava'
import MessageRepository from '../src/MessageRepository'

test('MessageRepository tests', t => {
  const repo = new MessageRepository()

  t.false(repo.hasLocale('ko'))
  repo.add('ko', {
    'test1': 1,
    'test2': 2
  })
  t.true(repo.hasLocale('ko'))

  t.is(repo.getMessageOrKey(['ko'], 'test1'), 1)
})
