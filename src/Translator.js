import makeFetchValueFunc from './makeFetchValueFunc'

export default class Translator {
  /**
   * @param {MessageRepository} repository
   */
  constructor (repository) {
    this._repository = repository

    // these props must be initialized by setter method.
    this._locale = null
    this._tag = null
    this._fetchValue = null

    this._fallbacks = []
    this._formatters = []
    this._filters = {}

    this._fetchValueFormatter = this._fetchValueFormatter.bind(this)
    this._escapeCharFormatter = this._escapeCharFormatter.bind(this)
  }

  message (local, texts = {}) {
    this._repository.addMessages(local, texts)

    return this
  }

  locale (locale) {
    if (!this._repository.hasLocale(locale)) {
      throw new TypeError(`"${locale}" messages have not been added.`)
    }

    this._locale = locale

    return this
  }

  /**
   * @param {function|function[]} formatters
   */
  formatter (formatters) {
    if (typeof formatters === 'function') formatters = [formatters]

    this._formatters.push(...formatters)

    return this
  }

  filter (name, filter) {
    if (typeof filter !== 'function') {
      throw new TypeError(`filter(${name}) is not a function type.`)
    }

    this._filters[name] = filter

    return this
  }

  /**
   * @param {string|string[]} fallbacks
   */
  fallback (fallbacks) {
    if (typeof fallbacks === 'string') fallbacks = [fallbacks]

    for (const fallback of fallbacks) {
      if (!this._repository.hasLocale(fallback)) {
        throw new TypeError(`"${fallback}" messages have not been added.`)
      }

      if (this._fallbacks.indexOf(fallback) === -1) {
        this._fallbacks.push(fallback)
      }
    }

    return this
  }

  tag ([prefix, suffix]) {
    if (typeof prefix !== 'string' || typeof suffix !== 'string') {
      throw new TypeError('prefix, or suffix is ​​not a string type.')
    }

    this._tag = [prefix, suffix]
    this._fetchValue = makeFetchValueFunc(prefix, suffix)

    return this
  }

  trans (key, values = {}, {locale, defaultMessage} = {}) {
    locale = this._normalizeLocale(locale)

    const message = this._findMessage(key, locale)
    const template = message ? message.template : defaultMessage

    return template ? this._applyFormatters(template, { ...values }, locale) : key
  }

  /**
   * @alias this.trans
   */
  t (...args) {
    return this.trans(...args)
  }

  _normalizeLocale (locale) {
    if (!locale) return this._locale
    if (this._repository.hasLocale(locale)) return locale

    throw new TypeError(`"${locale}" messages have not been added.`)
  }

  _findMessage (key, locale) {
    return this._repository.findMessageWithFallback([locale, ...this._fallbacks], key)
  }

  _applyFormatters (template, values, locale) {
    return [ this._fetchValueFormatter, this._escapeCharFormatter, ...this._formatters ]
      .reduce((template, formatter) => formatter(template, values, locale), template)
  }

  _fetchValueFormatter (template, values) {
    return this._fetchValue(template, values, this._filters)
  }

  _escapeCharFormatter (template) {
    return template.replace(/\\([[\]{}|])/g, '$1')
  }

  transChoice (key, number, values = {}, {locale, defaultMessage} = {}) {
    locale = this._normalizeLocale(locale)

    const message = this._findMessage(key, locale)
    const template = message ? message.findPluralTemplate(number) : defaultMessage

    return template ? this._applyFormatters(template, { ...values }, locale) : key
  }

  /**
   * @alias this.transChoice
   */
  tc (...args) {
    return this.transChoice(...args)
  }

  /**
   * @param {function|function[]} plugin
   */
  use (plugin) {
    if (typeof plugin === 'function') plugin = [plugin]

    plugin.forEach(plugin => plugin(this))

    return this
  }
}
