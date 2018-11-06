import test from 'ava'
import Translator from '../src/Translator'

test('If no message, return key', t => {
    const trans = new Translator()
    t.is(trans.t('no message'), 'no message')
    t.is(trans.t(''), '')
    t.is(trans.t('test', undefined, { defaults: '' }), '')
})

test('formatter', t => {
    let captureValue: any
    let captureLocale: any

    const trans = new Translator()
    trans
        .locale('en')
        .addMessages('en', { test: 'test' })
        .tag(['{', '}'])
        .addFormatter((str, value, locale) => {
            captureValue = value
            captureLocale = locale
            return '!!' + str + '!!'
        })

    t.is(trans.trans('test', { a: 'test' }), '!!test!!')
    t.deepEqual(captureValue, { a: 'test' })
    t.is(captureLocale, 'en')
})
