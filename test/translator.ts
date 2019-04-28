import test from 'ava'
import Translator from '../src/Translator'

const make = (messages: any) => (new Translator())
    .locale('en')
    .addMessages('en', messages)
    .tag(['{', '}'])

test('If no message, return key', t => {
    const trans = new Translator()
    t.is(trans.t('no message'), 'no message')
    t.is(trans.t(''), '')
    t.is(trans.t('test', undefined, { defaults: '' }), '')
})

test('add formatter, remove formatter', t => {
    let captureValue: any
    let captureLocale: any

    const formatter = (str: string, value: any, locale: string) => {
        captureValue = value
        captureLocale = locale
        return '!!' + str + '!!'
    }
    const trans = make({ test: 'test' }).addFormatter(formatter)

    t.is(trans.trans('test', { a: 'test' }), '!!test!!')
    t.deepEqual(captureValue, { a: 'test' })
    t.is(captureLocale, 'en')

    trans.removeFormatter(formatter)
    t.is(trans.trans('test', { a: 'test' }), 'test')
})

test('common filter', t => {
    const trans = make({ test: 'test{a}{b}' }).addFilter('*', str => (str as string).toUpperCase())
    t.is(trans.trans('test', { a: 'a', b: 'test' }), 'testATEST')
    trans.addFilter('*', str => (str as string) + 'abc')
    t.is(trans.trans('test', { a: 'a', b: 'test' }), 'testAabcTESTabc')
})

test('remove filter', t => {
    const upper = (str: string) => str.toUpperCase()
    const trans = make({ test: '{a|upper}' }).addFilter('upper', upper)
    t.is(trans.trans('test', { a: 'abc' }), 'ABC')
    trans.removeFilter('upper')
    t.is(trans.trans('test', { a: 'abc' }), 'abc')
    trans.addFilter('*', upper)
    t.is(trans.trans('test', { a: 'abc' }), 'ABC')
    trans.removeFilter('*')
    t.is(trans.trans('test', { a: 'abc' }), 'abc')
    trans.addFilter('*', upper)
    trans.removeFilter('*', () => '') // dummy
    t.is(trans.trans('test', { a: 'abc' }), 'ABC')
    trans.removeFilter('*', upper)
    t.is(trans.trans('test', { a: 'abc' }), 'abc')
})

test('changeLocale event', t => {
    const trans = (new Translator()).locale('en')
    t.plan(2)
    trans.on('changeLocale', () => t.pass())
    trans.locale('en')
    trans.locale('en')
    trans.locale('ko')
    trans.locale('ko')
    trans.locale('en')
})

test('changeFallbacks event', t => {
    const trans = (new Translator()).locale('en').fallbacks(['a'])
    t.plan(2)
    trans.on('changeFallbacks', () => t.pass())
    trans.fallbacks('a')
    trans.fallbacks('a')
    trans.fallbacks('b')
    trans.fallbacks(['b'])
    trans.fallbacks(['a', 'b'])
})

test('global event', t => {
    const trans = (new Translator()).locale('en').fallbacks(['a'])
    t.plan(4)
    trans.on('*', () => t.pass())
    trans.locale('ko')
    trans.locale('en')
    trans.fallbacks('b')
    trans.fallbacks('a')
})

test('Allow multiple types by default.', t => {
    const trans = new Translator()
    const obj = {}
    t.is(trans.t('test', undefined, { defaults: obj }), obj)
})
