import Message from './Message'

export default class MessageRepository {
  constructor () {
    this._repository = {}
  }

  add (locale, texts = {}) {
    const messages = this._repository[locale] || (this._repository[locale] = {})

    for (const key in texts) {
      const text = texts[key].toString ? texts[key].toString() : texts[key]

      if (typeof text !== 'string') {
        throw new TypeError(`This "${locale}.${key}" message is not a string type.`)
      }

      messages[key] = new Message(text)
    }
  }

  hasLocale (locale) {
    return this._repository.hasOwnProperty(locale)
  }

  /**
   * @param {string[]} locales
   * @param {string} key
   * @returns {Message|null}
   */
  findMessageWithFallback (locales, key) {
    for (const locale of locales) {
      const messages = this._repository[locale]

      if (messages.hasOwnProperty(key)) {
        return messages[key]
      }
    }

    return null
  }
}
