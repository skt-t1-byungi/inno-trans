# inno-trans
> 📜 simple localization library (inspired by laravel translation)

[![npm](https://img.shields.io/npm/v/inno-trans.svg?style=flat-square)](https://www.npmjs.com/package/inno-trans)
[![npm](https://img.shields.io/npm/dt/inno-trans.svg?style=flat-square)](https://www.npmjs.com/package/inno-trans)

## Install
```sh
yarn add inno-trans
```
```js
//es6
import trans from "inno-trans";

//commonjs
const trans = require('inno-trans');
```
### browser
```html
<script src="https://unpkg.com/inno-trans"></script>
<script>
 var trans = InnoTrans;
</script>
```

## Example
### Basic
```js
const lang = trans({
  locale: 'en',
  message: {
    en: { 'hello': 'hello~!' }
  }
})

> lang.trans('hello')
```
output
```
hello~!
```

### Variable
```js
...
message: { en: { 'hello': '{name}, hello~!' } }
...

> lang.trans('hello', {name: 'byungi'})
```
output
```
byungi, hello~!
```

#### Change tag
```js
  tag: ['<%=', '%>'],
  message: { en: { 'hello': '<%=name%>, hello~!' } }

```

### Pluralization
```js
...
message: { en: { apples: 'one apple|many apples' } }
...

> lang.transChoice('apples', 1)
> lang.transChoice('apples', 2)
```
output
```
one apple
many apples
```

### Complex pluralization
```js
...
message: { en: { apples : '{0}none|[1,19]some|[20,*]many' } }
...

> lang.transChoice('apples', 0)
> lang.transChoice('apples', 19)
> lang.transChoice('apples', 20)
```
output
```
none
some
many
```

### Fallback
```js
const lang = trans({
  locale: 'en',
  fallback:['ko'], // Specifies a fallback language.
  message: {
    en: { 'hello': 'hello!' },
    ko: { 'ok': '👌' },
  }
})

> lang.trans('hello')
> lang.trans('ok')
```
output
```
hello!
👌
```

### Formatter
```js
const customFormatter = (message, values, locale) =>{
  return '~~' + message + '~~'
}

const lang = trans({
  formatter: [customFormatter],
  message: { en: { 'hello': 'hello!' } }
  ...
})

> lang.trans('hello')
```
output
```
~~hello!~~
```

### Filter
```js
const lang = trans({
  filter: {
    upper: v => v.toUpperCase() //add filter
  },
  message: {
    en: { 'hello': 'hello! {name|upper}!' }, // using by "|"
  }
  ...
})

> lang.trans('hello', {name: 'byungi'})
```
output
```
hello, BYUNGI!
```

### Possible to load lazily
```js
lang
  .use(plugin)
  .message('en', {apple : 'an apple|apples'})
  .formatter([formatter1, formatter2])
  .filter('upper', upperFilter)
  .fallback(['ko', 'jp'])
  .tag(['<%=', '%>'])
```

### Plugin 
```js
const plugin = lang => {
  lang.message(...).filter(...).formatter(...);
}

const lang = trnas({
  plugin: [plugin]
  ...
})
```

### Short method
```js
const __ = trnas({...})

> __.t('hello') // alias "trans"
> __.tc('apple', 3) // alias "transChoice"
```

## Plugins
[inno-trans-korean-josa-plugin](https://github.com/skt-t1-byungi/inno-trans-korean-josa-plugin)

## License
MIT