# inno-trans
> 📜 simple localization library (inspired by laravel translation)

## Install
```sh
yarn add inno-trans
```
```js
//es6
import trans from "inno-trans";

//commonjs
var trans = require('inno-trans');
```

## Example
### Basic
```js
const lang = trans({
  locale: 'en',
  message: {
    en: { 'hello': '{name}, hello!' }
  }
})

> lang.trans('hello', {name: "byungi"})
```
output
```
byungi, hello!
```

### Pluralization
```js
...
messages: { en: { apples: 'one apple|many apples' } }
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
messages: { en: { apples : '{0}none|[1,19]some|[20,*]many' } }
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

### possible to load lazily.
```
lang.message('en', addMessages)
  .filter([filter1, filter2])
  .fallback(['ko', 'jp'])
```

## License
MIT