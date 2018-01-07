import replace from './replace'

export default class Translator {
  /**
   * @param {MessageRepository} repository
   */
  constructor (repository) {
    this._repository = repository

    // these props must be initialized by setter method.
    this._fallbacks = []
    this._filters = []
    this._locale = null
    this._tagged = null

    this.trans = this.trans.bind(this)
    this.transChoice = this.transChoice.bind(this)
    this._fetchValuesFilter = this._fetchValuesFilter.bind(this)
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

    this._tagged = [prefix, suffix]

    return this
  }

  trans (key, values = {}, locale = null) {
    if (locale & !this._repository.hasLocale(locale)) {
      throw new TypeError(`"${locale}" messages have not been added.`)
    }

    const message = this._getMessageOrNull(key, locale || this._locale)

    return message ? this._applyFilters(message.template(), { ...values }) : key
  }

  _getMessageOrNull (key, locale) {
    const locales = [locale, ...this._fallbacks]

    return this._repository.findMessageWithFallback(locales, key)
  }

  _applyFilters (template, values) {
    return [...this._filters, this._fetchValuesFilter]
      .reduce((template, filter) => filter(template, values, this._locale), template)
  }

  _fetchValuesFilter (message, values) {
    return replace(message, values, this._tagged)
  }

  transChoice (key, number, values = {}, locale = null) {
    if (locale & !this._repository.hasLocale(locale)) {
      throw new TypeError(`"${locale}" messages have not been added.`)
    }

    const message = this._getMessageOrNull(key, locale || this._locale)

    return message ? this._applyFilter(message.choiceTemplate(), {...values}) : key
  }
}
