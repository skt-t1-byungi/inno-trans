import parsePlurals from './parsePlurals'

export default class Message {
  constructor (text) {
    this._text = text
    this._plurals = null
    this._tempalte = null
  }

  get plurals () {
    return this._plurals || (this._plurals = parsePlurals(this._text))
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
