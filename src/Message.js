import parse from './parse'
import replace from './replace'

export default class Message {
  constructor (text) {
    this._text = text
    this._parsing = null
  }

  get parsing () {
    return this._parsing || (this._parsing = parse(this._text))
  }

  trans (tagged, data = null) {
    return typeof data === 'object' ? replace(this._text, data, tagged) : this._text
  }

  transChoice (number, tagged, data = null) {
    const plural = this.parsing.plural
      .find(({min, max}) => number <= max && number >= min)

    const text = plural ? plural.value : this._text

    return typeof data === 'object' ? replace(text, data, tagged) : this._text
  }
}
