# inno-trans
📜 simple localization library (inspired by laravel translation)

[![npm](https://flat.badgen.net/npm/v/inno-trans)](https://www.npmjs.com/package/inno-trans)
[![downloads](https://flat.badgen.net/npm/dt/inno-trans)](https://www.npmjs.com/package/inno-trans)

## Example
```js
const t = InnoTrans({
    locale: 'en',
    message: {
        en: {
            'hello': 'hello world!'
        }
    }
})

t.trans('hello') // => hello world!
```

## Install
```sh
yarn add inno-trans
```
```js
const InnoTrans = require('inno-trans');
```

### browser
```html
<script src="https://unpkg.com/inno-trans"></script>
<script>
 var t = InnoTrans({...});
</script>
```
## Features

### Interpolation
You can use a tag(`{}`) to replace a string with a variable.
```json
{
    "welcome": "welcome, {name}!"
}
```
```js
t.trans('welcome', {name: 'john'}) // => welcome, john!
```
### Change interpolation tag
```json
{
    "welcome": "welcome, <?=name=>!"
}
```
```js
t.tag(['<?=', '=>'])
t.trans('welcome', {name: 'john'}) // => welcome, john!
```

### Pluralization
You can choose a message that matches the quantity
```json
{
    "apples": "one apple|many apples"
}
```
```js
t.transChoice('apples', 1) // => one apple
t.transChoice('apples', 2) // => many apples
```
#### Complex pluralization
```json
{
    "apples": "{0}none|[1,19]some|[20,*]many"
}
```
```js
t.transChoice('apples', 0) // => none
t.transChoice('apples', 10) // => some
t.transChoice('apples', 20) // => many
```

### Fallback
Fallback a different locale when there is no message.
```json
{
    "en": {},
    "ko": {
        "index.hello": "안녕~"
    },
    "ja": {
        "index.hello": "こんにちは~",
        "index.welcome": "歓迎よ~"
    }
}
```
```js
t.trans('index.hello') // => index.hello
t.trans('index.welcome') // => index.welcome

t.fallbacks(['ko', 'ja'])

t.trans('index.hello') // => 안녕~
t.trans('index.welcome') // => 歓迎よ~
```

### Filter
You can write in the message a filter that converts the value.
```json
{
    "welcome": "welcome, {name|upper}!",
    "hello": "hello, {name|lower}!"
}
```
```js
t.addFilter('upper', str => str.toUpperCase())
t.addFilter('lower', str => str.toLowerCase())

t.trans('welcome', {name: 'John'}) // => welcome JOHN!
t.trans('hello', {name: 'John'}) // => hello john!
```

### Formatter
Converts interpolated messages. `values` used for interpolation, and `locale` where messages are located. This is useful when writing plugins.

```json
{
    "welcome": "<p>welcome, {name}!</p>",
    "hello": "<span>hello, {name}!</span>"
}
```
```js
const toRedText = (str, values, locale) => str.replace(/<(\S+)>(.*?)<\/\1>/, '<$1 style="color:red">$2</$1>')
t.addFormatter(toRedText)

t.trans('welcome', {name: 'john'})
// => <p style="color:red">welcome, john!</p>
t.trans('hello', {name: 'john'})
// => <div style="color:red">hello, john!</div>
```

## API
### trans(options)
Create InnoTrans instance.

```js
trans({
    locale: 'en',
    fallbacks: ['ko', 'ja'],
    messages: {
        en: {
            'welcome': 'welcome, {name}!'
        },
        ko: {
            'welcome': '환영해, {name}!'
        },
        ja: {
            'welcome': '歓迎よ, {name}!'
        }
    },
    tag: ['{', '}'],
    filters: {
        upper: str => str.toUpperCase(),
        lower: str => str.toLowerCase(),
    },
    formatters: [
        str => str + 😝
    ]
})
```

#### options
- `locale` - Specifies locale. If not specified, it is automatically inferred. `UNKNOWN` is specified when inferring fails.
- `fallbacks` - Specifies another locale to look for messages that are not in the current locale.
- `messages` - Message resources.
- `tag` - Prefix and suffix for interpolation. Default `{}`.
- `filters` - Function for converting interpolation values.
- `formatters` - Function for converting interpolated message.
- `plugins` - Plugin to use with.

### t.trans(key [, values [, options]])
Returns a message that matches the key.

#### options
- `locale` - Specifies the locale. The current locale is ignored.
- `defaults` - String to return when the message does not exist. If not, a key is returned.

```js
const t = InnoTrans({
    locale: 'en',
    messages: {
        en: { hello: 'hello!' },
        ko: { hello: '안녕!' }
    }
})

t.trans('welcome') // => welcome
t.trans('welcome', undefined, {defaults: 'Welcome~!'}) // => Welcome~!
t.trans('hello') // => hello!
t.trans('hello', undefined, {locale: 'ko'}) // => 안녕
```

Supports short method name.

```js
t.t('hello', {name: 'john'})
```

### t.transChoice(key, number [, values [, options]])
Returns a message that matches the key and the quantity number.

```js
t.addMessages('en', {bought: 'I bought one|I bought many things!'})

t.transChoice('bought', 1) // => I bought one
t.transChoice('bought', 10) // => I bought many things!
```

Supports short method name.

```js
t.tc('apples', 3, {count: 3});
```

### t.locale([locale])
If the `locale` argument exists, set a new locale. If not, it returns current locale.

```js
t.locale('ko') // Change locale to "ko".
t.locale() // => 'ko'
```

### t.fallbacks([fallbacks])
If the `fallbacks` argument exists, set a new fallbacks. If not, it returns current fallbacks.

```js
t.fallbacks(['ko', 'ja']) // Change fallback locale to "ko" and "ja".
t.fallbacks() // => ['ko', 'ja']
```

### t.addMessages(locale, messages)
Add messages.

```js
t.addMessages('en', {
    'welcome': 'Welcome, {name}!',
    'hello': 'hello, {name}!'
})
```

### t.removeMessages([locales])
Remove messages. If no `locales` argument, remove all.

```js
t.removeMessages('en')
t.removeMessages(['ko', 'ja'])
t.removeMessages() // Warning! Remove all.
```

### t.getAddedLocales()
Returns the added message locales.

```js
t.getAddedLocales() // => ['en', 'ko', 'ja']
t.removeMessages('en')
t.getAddedLocales() // => ['ko', 'ja']
```

### t.hasMessage(locale [, key])
Returns true if the message exists.

```js
t.hasMessage('ko') // => false

t.addMessages('ko', {hello: '안녕!'})

t.hasMessage('ko') // => true
t.hasMessage('ko', 'hello') // => true
t.hasMessage('ko', 'others') // => false
```

### t.tag(tag)
Set prefix and suffix for interpolation.

```js
t.tag(['<?=', '=>'])
```

### t.addFilter(name, filter)
Add a filter function.

### t.addFormatter(formatter)
Add a formatter function.

### t.use(plugin)
Add a plugin.

## Plugins
- [inno-trans-korean-josa-plugin](https://github.com/skt-t1-byungi/inno-trans-korean-josa-plugin)
- [inno-trans-react-element-plugin](https://github.com/skt-t1-byungi/inno-trans-react-element-plugin)

## License
MIT
