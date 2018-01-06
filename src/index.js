import MessageRepository from './MessageRepository'
import Translator from './Translator'

export default function trans (
  {
    message = {},
    locale,
    fallback,
    tag
  } = {}
) {
  const translator = new Translator(new MessageRepository())

  for (const locale in message) {
    translator.message(locale, message[locale])
  }

  if (locale) {
    translator.locale(locale)
  }

  if (fallback) {
    translator.fallback(fallback)
  }

  translator.tag(tag || ['{', '}'])

  return translator
}
