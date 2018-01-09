import MessageRepository from './MessageRepository'
import Translator from './Translator'

export default function trans (
  {
    locale,
    message = {},
    fallback = [],
    filter = {},
    tag = ['{', '}'],
    formatter = []
  } = {}
) {
  if (!locale) {
    throw new TypeError('The "locale" option is required.')
  }

  const translator = new Translator(new MessageRepository())

  for (const locale in message) {
    translator.message(locale, message[locale])
  }

  for (const name in filter) {
    translator.filter(name, filter[name])
  }

  return translator
    .locale(locale)
    .fallback(fallback)
    .tag(tag)
    .formatter(formatter)
}
