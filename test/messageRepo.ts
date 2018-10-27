import test from 'ava'
import MessageRepo from '../src/MessageRepo'

const stubMessages = { a: '', b: '', c: '' }

test('addMessages', t => {
    const repo = new MessageRepo()
    t.false(repo.hasLocale('ko'))
    repo.addMessages('ko', stubMessages)
    t.true(repo.hasLocale('ko'))
})

test('no add if empty messages', t => {
    const repo = new MessageRepo()
    t.false(repo.hasLocale('ko'))
    repo.addMessages('ko', {})
    t.false(repo.hasLocale('ko'))
})

const removeStub = () => {
    const repo = new MessageRepo()
    repo.addMessages('ko', stubMessages)
    repo.addMessages('en', stubMessages)
    return repo
}

test('removeMessage - string', t => {
    const repo = removeStub()
    const removes = repo.removeMessages('ko')
    t.deepEqual(removes, ['ko'])
    t.deepEqual(repo.getLocales(), ['en'])
})

test('removeMessage - string[]', t => {
    const repo = removeStub()
    const removes = repo.removeMessages(['ko', 'en'])
    t.deepEqual(removes, ['ko','en'])
    t.deepEqual(repo.getLocales(), [])
})

test('removeMessage - all', t => {
    const repo = removeStub()
    const removes = repo.removeMessages()
    t.deepEqual(removes, ['ko','en'])
    t.deepEqual(repo.getLocales(), [])
})

const findStub = () => {
    const repo = new MessageRepo()
    repo.addMessages('ko', { a: '1', b: '2' })
    repo.addMessages('en', { c: '3' })
    return repo
}

test('findMessage', t => {
    const repo = findStub()
    const message = repo.findMessage(['ko'], 'a')
    t.truthy(message)
    t.is(message!.template(), '1')
    t.falsy(repo.findMessage(['ko'], 'c'))
    t.falsy(repo.findMessage(['en'], 'a'))
})

test('findMessage with fallback', t => {
    const repo = findStub()
    const message = repo.findMessage(['ko', 'en'], 'c')
    t.truthy(message)
    t.is(message!.template(), '3')
})
