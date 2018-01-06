export default class Translator {
  /**
   * @param {MessageRepository} repository
   * @param {string} locale
   * @param {string[]} fallbacks
   * @param {[string, string]} tagged
   */
  constructor (repository, locale, fallbacks = [], tagged = []) {
    this._repository = repository
    this._locale = locale
    this._fallbacks = fallbacks
    this._tagged = tagged
  }

  message (local, texts = {}) {
    this._repository.add(local, texts)

    return this
  }

  locale (locale) {
    if (!this._repository.hasLocale(locale)) {
      throw new TypeError(`There are no messages for "${locale}".`)
    }

    this._locale = locale

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
        throw new TypeError(`There are no messages for "${fallback}".`)
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

  trans (key, data = null) {
    const message = this._repository.getMessageWithFallback([this._locale, ...this._fallbacks], key)

    if (!message) {
      return key
    }

    return message.trans(this._tagged, data)
  }

  transChoice (key, number, data = null) {
    const message = this._repository.getMessageWithFallback([this._locale, ...this._fallbacks], key)

    if (!message) {
      return key
    }

    return message.transChoice(number, this._tagged, data)
  }
}
