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

test('formatter', t => {
    let captureValue: any
    let captureLocale: any

    const trans = make({ test: 'test' })
        .addFormatter((str, value, locale) => {
            captureValue = value
            captureLocale = locale
            return '!!' + str + '!!'
        })

    t.is(trans.trans('test', { a: 'test' }), '!!test!!')
    t.deepEqual(captureValue, { a: 'test' })
    t.is(captureLocale, 'en')
})

test('common filter', t => {
    const trans = make({ test: 'test{a}{b}' }).addFilter('*', str => (str as string).toUpperCase())
    t.is(trans.trans('test', { a: 'a', b: 'test' }), 'testATEST')
    trans.addFilter('*', str => (str as string) + 'abc')
    t.is(trans.trans('test', { a: 'a', b: 'test' }), 'testAabcTESTabc')
})
