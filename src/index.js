import MessageRepository from './MessageRepository'
import Translator from './Translator'

export default function trans (
  {
    locale,
    message = {},
    fallback = [],
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

  return translator
    .locale(locale)
    .fallback(fallback)
    .tag(tag)
    .formatter(formatter)
}
