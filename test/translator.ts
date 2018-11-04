import test from 'ava'
import Translator from '../src/Translator'

test('If no message, return key', t => {
    const trans = new Translator()
    t.is(trans.t('no message'), 'no message')
    t.is(trans.t(''), '')
    t.is(trans.t('test', undefined, { defaults: '' }), '')
})
