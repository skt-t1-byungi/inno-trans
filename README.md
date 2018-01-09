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

### Support variable
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

### Support fallback
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

### Support Filter
```js
const customFilter = (message, values, locale, tag) =>{
  return '~~' + message + '~~'
}

const lang = trans({
  locale: 'en',
  filter: [customFilter],
  message: {
    en: { 'hello': 'hello!' },
  }
})

> lang.trans('hello')
```
output
```
~~hello!~~
```

### Possible to load lazily
```js
lang
  .message('en', {
    'apple' : 'an apple|apples'
  })
  .filter([filter1, filter2])
  .fallback(['ko', 'jp'])
  .tag(['<%=', '%>'])
```

## License
MIT