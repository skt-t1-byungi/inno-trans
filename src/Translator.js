import { fetchValuesFilter } from './filters'

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
    this._filters = []
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
   * @param {function|function[]} filters
   */
  filter (filters) {
    if (typeof filters === 'function') {
      filters = [filters]
    }

    this._filters.push(...filters)

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

    return message ? this._applyFilters(message.template, { ...values }, locale) : key
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

  _applyFilters (template, values, locale) {
    const filters = [ ...this._filters, fetchValuesFilter ]

    return filters.reduce((template, filter) => filter(template, values, locale, this._tag), template)
  }

  transChoice (key, number, values = {}, locale = null) {
    locale = this._normalizeLocale(locale)
    const message = this._findMessage(key, locale)

    if (!message) {
      return key
    }

    const template = message.findPluralTemplate(number)

    return template ? this._applyFilters(template, { ...values }, locale) : key
  }
}
