export default class Translator {
  constructor (messages, locale, fallbacks) {
    this._messages = messages
    this._locale = locale
    this._fallbacks = fallbacks || []
  }

  message (local, message) {
    this._messages.add(local, message)

    return this
  }

  locale (locale) {
    this._locale = locale

    return this
  }

  fallback (fallback) {
    this._fallbacks.push(fallback)
  }

  trans (key, data) {
  }

  transChoice (key, data) {
  }
}
