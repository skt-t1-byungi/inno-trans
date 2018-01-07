import parse from './parse'

export default class Message {
  constructor (text) {
    this._text = text
    this._parsed = null
  }

  get parsed () {
    return this._parsed || (this._parsed = parse(this._text))
  }

  get template () {
    return this._text
  }

  /**
   * @param {number} number
   * @returns {string|null}
   */
  findPluralTemplate (number) {
    const plural = this.parsed
      .find(({min, max}) => number <= max && number >= min)

    return plural ? plural.value : null
  }
}
