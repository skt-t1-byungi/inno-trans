import test from 'ava'
import detectLocale from '../src/detectLocale'

test('detectLocale', t => {
    process.env.LC_ALL = 'ko-KR'
    t.is(detectLocale([]), 'ko-KR')
    t.is(detectLocale(['en']), 'ko-KR')
    t.is(detectLocale(['en', 'ko']), 'ko')
})
