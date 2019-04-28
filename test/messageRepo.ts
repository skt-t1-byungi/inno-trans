import test from 'ava'
import MessageRepo from '../src/MessageRepo'

const stubMessages = { a: '', b: '', c: '' }

test('addMessages', t => {
    const repo = new MessageRepo()
    t.false(repo.hasMessage('ko'))
    repo.addMessages('ko', stubMessages)
    t.true(repo.hasMessage('ko'))
})

test('do not add empty messages', t => {
    const repo = new MessageRepo()
    t.false(repo.hasMessage('ko'))
    repo.addMessages('ko', {})
    t.false(repo.hasMessage('ko'))
})

test('hasMessage by key', t => {
    const repo = new MessageRepo()
    t.false(repo.hasMessage('ko', 'a'))
    repo.addMessages('ko', stubMessages)
    t.true(repo.hasMessage('ko', 'a'))
})

const removeStub = () => {
    const repo = new MessageRepo()
    repo.addMessages('ko', stubMessages)
    repo.addMessages('en', stubMessages)
    return repo
}

test('removeMessages - string', t => {
    const repo = removeStub()
    repo.removeMessages('ko')
    t.deepEqual(repo.getAddedLocales(), ['en'])
})

test('removeMessages - key', t => {
    const repo = removeStub()
    t.true(repo.hasMessage('ko', 'a'))
    repo.removeMessages('ko', 'a')
    t.false(repo.hasMessage('ko', 'a'))
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
