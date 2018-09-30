import find from '@skt-t1-byungi/array-find'
import Translator from './Translator'
import { Formatter, Plugin, TemplateLocaleMap, ValueFilterMap } from './types'
import { hasOwn } from './util'

interface TranslatorOptions {
    locale: string,
    fallback: string[],
    message: TemplateLocaleMap,
    filter: ValueFilterMap,
    tag: [string, string],
    formatter: Formatter[],
    plugin: Plugin[]
}

export = function InnoTrans ({
    locale,
    message = {},
    fallback = [],
    filter = {},
    tag = ['{', '}'],
    formatter = [],
    plugin = []
}: Partial<TranslatorOptions> = {}) {
    const translator = new Translator()
    const candidates = []

    for (const locale in message) {
        if (hasOwn(message, locale)) {
            candidates.push(locale)
            translator.message(locale, message[locale])
        }
    }

    for (const name in filter) {
        if (hasOwn(message, name)) translator.filter(name, filter[name])
    }

    for (const fn of formatter) translator.formatter(fn)

    return translator
        .locale(locale || detectLocale(candidates))
        .fallback(fallback)
        .tag(tag)
        .use(plugin)
}

function detectLocale (candidates: string[]) {
    const lang = navigator.language || (navigator as (Navigator & { userLanguage: string })).userLanguage
    return find(candidates, str => lang.match(str) !== null) || lang
}
