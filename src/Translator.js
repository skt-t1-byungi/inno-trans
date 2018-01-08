import { fetchValuesFormatter } from './formatter'

export default class Translator {
  /**
   * @param {MessageRepository} repository
   */
  constructor (repository) {
    this._repository = repository

    // these props must be initialized by setter method.
    this._locale = null
    this._tag = null

    this._fallbacks = []
    this._formatters = []
  }

  message (local, texts = {}) {
    this._repository.add(local, texts)

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
    if (typeof formatters === 'function') {
      formatters = [formatters]
    }

    this._formatters.push(...formatters)

    return this
  }

  /**
   * @param {string|string[]} fallbacks
   */
  fallback (fallbacks) {
    if (typeof fallbacks === 'string') {
      fallbacks = [fallbacks]
    }

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

    return this
  }

  trans (key, values = {}, locale = null) {
    locale = this._normalizeLocale(locale)

    const message = this._findMessage(key, locale)

    return message ? this._applyFormatters(message.template, { ...values }, locale) : key
  }

  _normalizeLocale (locale) {
    if (!locale) {
      return this._locale
    }

    if (this._repository.hasLocale(locale)) {
      return locale
    }

    throw new TypeError(`"${locale}" messages have not been added.`)
  }

  _findMessage (key, locale) {
    const locales = [locale, ...this._fallbacks]

    return this._repository.findMessageWithFallback(locales, key)
  }

  _applyFormatters (template, values, locale) {
    const formatters = [ ...this._formatters, fetchValuesFormatter ]

    return formatters.reduce((template, formatter) => formatter(template, values, locale, this._tag), template)
  }

  transChoice (key, number, values = {}, locale = null) {
    locale = this._normalizeLocale(locale)
    const message = this._findMessage(key, locale)

    if (!message) {
      return key
    }

    const template = message.findPluralTemplate(number)

    return template ? this._applyFormatters(template, { ...values }, locale) : key
  }
}
