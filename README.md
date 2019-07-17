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
Interpolate using tag bracket (`{}`).
```js
const t = InnoTrans({
    locale: 'en',
    message: {
        en: {
            welcome: 'welcome, {name}!'
        }
    }
})
```
```js
t.trans('welcome', {name: 'john'}) // => welcome, john!
```

#### Change interpolation tag bracket.

```js
const t = InnoTrans({
    locale: 'en',
    message: {
        en: {
            welcome: 'welcome, <?=name=>!'
        }
    }
})
```
```js
t.tag(['<?=', '=>'])
t.trans('welcome', {name: 'john'}) // => welcome, john!
```

### Pluralization
Choose a message that matches the quantity.

```js
const t = InnoTrans({
    locale: 'en',
    message: {
        en: {
            apples: 'one apple|many apples'
        }
    }
})
```
```js
t.transChoice('apples', 1) // => one apple
t.transChoice('apples', 2) // => many apples
```
#### Complex pluralization

```js
const t = InnoTrans({
    locale: 'en',
    message: {
        en: {
            apples: '{0}none|[1,19]some|[20,*]many'
        }
    }
})
```
```js
t.transChoice('apples', 0) // => none
t.transChoice('apples', 10) // => some
t.transChoice('apples', 20) // => many
```

### Fallback
Fallback a another locale when there is no message.

```js
const t = InnoTrans({
    locale: 'en',
    message: {
        en: {},
        ko: {
            'index.hello': '안녕~'
        },
        ja: {
            'index.hello': 'こんにちは~',
            'index.welcome': '歓迎よ~'
        }
    }
})
```
```js
t.trans('index.hello') // => index.hello
t.trans('index.welcome') // => index.welcome

t.fallbacks(['ko', 'ja'])

t.trans('index.hello') // => 안녕~
t.trans('index.welcome') // => 歓迎よ~
```

### Filter
Converts interpolation values.

```js
const t = InnoTrans({
    locale: 'en',
    message: {
        en: {
            welcome: 'welcome, {name|upper}!',
            hello: 'hello, {name|lower}!'
        }
    }
})
```
```js
t.addFilter('upper', str => str.toUpperCase())
t.addFilter('lower', str => str.toLowerCase())

t.trans('welcome', {name: 'John'}) // => welcome JOHN!
t.trans('hello', {name: 'John'}) // => hello john!
```

#### Common filter
```js
const t = InnoTrans({
    locale: 'en',
    message: {
        en: {
            abc: 'ab {0} {1}'
        }
    }
})
```
```js
t.addFilter('*', str => str.toUpperCase())
t.trans('abc', {0: 'cd', 1: 'ef') // => ab CD EF
```

### Formatter
Converts interpolated messages.

```js
const t = InnoTrans({
    locale: 'en',
    message: {
        en: {
            welcome: 'welcome, {name}!',
        }
    }
})
```
```js
t.addFormatter((str, values, locale)=> {
    console.log(`str: ${str}, values: ${JSON.stringify(values)}, locale: ${locale}`)
    return '<p>' + str + '</p>'
})

t.trans('welcome', {name: 'john'})
// str: welcome, john!, values: {"name":"john"}, locale: en
// => <p>welcome, john!</p>
```

### Event

```js
const t = InnoTrans({
    locale: 'en',
    message: {
        en: {
            welcome: 'welcome, {name}!',
        },
        ko: {
            welcome: '안녕, {name}!',
        }
    }
})

t.trans('welcome', {name: 'john'}) // => welcome, john!

t.on('changeLocale', () => {
    t.trans('welcome', {name: 'john'}) // => 안녕, john!
})

t.locale('ko')
```

#### events
- `changeLocale`
- `changeFallbacks`
- `changeTag`
- `addMessages`
- `removeMessages`
- `addFilter`
- `removeFilter`
- `addFormatter`
- `removeFormatter`
- `*` - Global event.

## API
### InnoTrans(options)
Create InnoTrans instance.

```js
const t = InnoTrans({
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
- `locale` - Specifies current locale. If not, it is automatically inferred.
- `fallbacks` - Specifies another locales to fallback.
- `messages` - Message resources.
- `tag` - Prefix and suffix for interpolation. Default `{`,`}`.
- `filters` - Function for converting interpolation values.
- `formatters` - Function for converting interpolated message.
- `plugins` - Plugin to use.

### t.trans(key [, values [, options]])
Returns a message that matches the key.

#### options
- `locale` - Specifies the locale. The current locale is ignored.
- `defaults` - String to return instead of the key when a message does not exist.

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

#### Short method

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

#### Short mehotd
```js
t.tc('apples', 3, {count: 3});
```

### t.locale([locale])

```js
t.locale('ko') // Change locale to "ko".
t.locale() // => 'ko'
```

### t.fallbacks([fallbacks])

```js
t.fallbacks(['ko', 'ja'])
t.fallbacks() // => ['ko', 'ja']
```

### t.addMessages(locale, messages)

```js
t.addMessages('en', {
    'welcome': 'Welcome, {name}!',
    'hello': 'hello, {name}!'
})
```

### t.removeMessages(locale[, key])
If no `key` argument, remove all messages in the locale.

```js
t.removeMessages('en', 'welcome')
t.removeMessages('en')
```

### t.getAddedLocales()
Returns the added message locales.

```js
t.getAddedLocales() // => ['en', 'ko', 'ja']
t.removeMessages('en')
t.getAddedLocales() // => ['ko', 'ja']
```

### t.hasMessage(locale [, key])
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

### t.removeFilter(name[, filter])
Remove a filter function.

### t.addFormatter(formatter)
Add a formatter function.

### t.removeFormatter(formatter)
Remove a formatter function.

### t.use(plugin)
Add a plugin.

## License
MIT
