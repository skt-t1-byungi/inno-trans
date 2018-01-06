import MessageRepository from './MessageRepository'
import Translator from './Translator'

export default function trans (
  {
    message = {},
    fallback = [],
    locale,
    tag
  } = {}
) {
  const translator = new Translator(new MessageRepository())

  for (const locale in message) {
    translator.message(locale, message[locale])
  }

  return translator
    .locale(locale)
    .fallback(fallback)
    .tag(tag || ['{', '}'])
}
