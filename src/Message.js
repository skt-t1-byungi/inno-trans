import parsePlural from './parse/plural'

export default class Message {
  constructor (text) {
    this._text = text
    this._plurals = null
  }

  get plurals () {
    return this._plurals || (this._plurals = parsePlural(this._text))
  }

  get template () {
    return this._text
  }

  /**
   * @param {number} number
   * @returns {string|null}
   */
  findPluralTemplate (number) {
    const plural = this.plurals.find(({min, max}) => number <= max && number >= min)

    return plural ? plural.value : null
  }
}
