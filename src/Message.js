import parse from './parse'

export default class Message {
  constructor (text) {
    this._text = text
    this._parsing = null
  }

  get parsing () {
    return this._parsing || (this._parsing = parse(this._text))
  }
}
