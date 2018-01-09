import test from 'ava'
import trans from '../src/index'

test('basic', t => {
  const lang = trans({
    locale: 'ko',
    message: {
      ko: { 
        'test1': '테스트 {name|a}' ,
        'test2': '테스트 {name|b}',
        'test3': '테스트 {name|a| b}', //with space
        'test4': '테스트 {name|b|c|a}' //with space, empty filter
      }
    },
    filter: {
      a : value => '$$' + value + '$$'
    }
  })

  t.is(lang.trans('test1', {name:"안녕"}), '테스트 $$안녕$$')
  t.is(lang.trans('test2', {name:"안녕"}), '테스트 안녕')
  t.is(lang.trans('test3', {name:"안녕"}), '테스트 $$안녕$$')
  t.is(lang.trans('test4', {name:"안녕"}), '테스트 $$안녕$$')

  lang.filter('b', value => '__' + value + '__')
  t.is(lang.trans('test1', {name:"안녕"}), '테스트 $$안녕$$')
  t.is(lang.trans('test2', {name:"안녕"}), '테스트 __안녕__')
  t.is(lang.trans('test3', {name:"안녕"}), '테스트 __$$안녕$$__')
  t.is(lang.trans('test4', {name:"안녕"}), '테스트 $$__안녕__$$')
})
