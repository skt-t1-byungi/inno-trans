# inno-trans
📜 simple localization library (inspired by laravel translation)

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
```js
const t = trans({
    locale: 'en',
    message: {
        en: {
            'hello': 'hello world!'
        }
    }
})

t.trans('hello') // => hello world!
```

## Interpolation
You can use a tag(`{}`) to replace a string with a variable.
```json
{
    "welcome": "welcome, {name}!"
}
```
```js
t.trans('welcome', {name: 'john'}) // => welcome, john!
```
### Change Tag
```json
{
    "welcome": "welcome, <?=name=>!"
}
```
```js
t.tag(['<?=', '=>'])
t.trans('welcome', {name: 'john'}) // => welcome, john!
```

## Pluralization
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
### Complex
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
### with Interpolation
```json
{
    "apples": "{0}none : {count}|[1,19]some : {count}|[20,*]many : {count}"
}
```
```js
t.transChoice('apples', 0, {count:0}) // => none : 0
t.transChoice('apples', 10, {count:10}) // => some : 10
t.transChoice('apples', 20, {count:20}) // => many : 20
```

## Fallback
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

## Filter
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

## Formatter
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
- `locale` - Specifies locale. If not specified, it is automatically inferred. 'UNKNOWN' is specified when inferring fails.
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

#### Short method
*`t.t(key [, values [, options]])`*

### t.transChoice(key, number [, values [, options]])
Returns a message that matches the key and the quantity number.

#### Short method
*`t.tc(key [, values [, options]])`*

### t.locale([locale])
If the `locale` argument exists, set a new locale. If not, it returns current locale.

### t.fallbacks([fallbacks])
If the `fallbacks` argument exists, set a new fallbacks. If not, it returns current fallbacks.

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

### t.getAddedLocales()
Returns the added message locales.

### t.hasMessage(locale [, key])
Returns true if the message exists.

### t.tag(tag)
Set prefix and suffix for interpolation.

```js
t.tag(['<?=', '=>'])
```

### t.addFilter(name, fn)
Add a filter function.

### t.addFormatter(formatter)
Add a formatter function.

### t.use(plugin)
Add a plugin.

## License
MIT
