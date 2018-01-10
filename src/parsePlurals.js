class Parser {
  constructor (text) {
    this._text = text
  }

  parse () {
    const texts = this._splitUsingDelimiter()

    return texts.length === 1 ? []
      : texts.map((...args) => this._parseSplitedText(...args))
  }

  _splitUsingDelimiter () {
    return this._text.match(/(?:({[^}]*})|([^{|])|(\|\|))+/g)
  }

  _parseSplitedText (text, index, texts) {
    text = text.replace(/\|\|/g, '|')

    return this._attemptEqualTypeParsing(text) || this._attemptBetweenTypeParsing(text) ||
    {
      min: index === 0 ? -Infinity : index + 1,
      max: index === texts.length - 1 ? Infinity : index + 1,
      value: text
    }
  }

  _attemptEqualTypeParsing (text) {
    const regex = /^\{\s*(\d+)\s*\}/
    const matched = regex.exec(text)

    if (!matched) {
      return null
    }

    const [, equalNumberStr] = matched
    const equalNumber = this._parseNumber(equalNumberStr)

    return {
      min: equalNumber,
      max: equalNumber,
      value: text.replace(regex, '')
    }
  }

  _parseNumber (str) {
    switch (str) {
      case '-*':
        return -Infinity
      case '*':
        return Infinity
      default:
        return parseInt(str, 10)
    }
  }

  _attemptBetweenTypeParsing (text) {
    const regex = /^\[\s*(-?(?:\d+|\*))\s*,\s*(-?(?:\d+|\*))\s*\]/
    const matched = regex.exec(text)

    if (!matched) {
      return null
    }

    const [, min, max] = matched

    return {
      min: this._parseNumber(min),
      max: this._parseNumber(max),
      value: text.replace(regex, '')
    }
  }
}

export default function (text) {
  return (new Parser(text)).parse()
}
