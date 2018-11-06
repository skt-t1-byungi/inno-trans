import find from '@skt-t1-byungi/array-find'
import Translator from './Translator'
import { Formatter, Plugin, TemplateLocaleMap, ValueFilterMap } from './types'
import { each } from './util'

interface TranslatorOptions {
    locale: string,
    fallbacks: string[],
    messages: TemplateLocaleMap,
    filters: ValueFilterMap,
    tag: [string, string],
    formatters: Formatter[],
    plugins: Plugin[]
}

export = function InnoTrans ({
    locale,
    messages = {},
    fallbacks = [],
    filters = {},
    tag = ['{', '}'],
    formatters = [],
    plugins = []
}: Partial<TranslatorOptions> = {}) {
    const translator = new Translator()
    const locales: string[] = []

    each(messages, (templates, locale) => {
        locales.push(locale)
        translator.addMessages(locale, templates)
    })

    each(filters, (filter, name) => translator.addFilter(name, filter))
    for (const fn of formatters) translator.addFormatter(fn)

    translator.locale(locale || detectLocale(locales))
    translator.fallbacks(fallbacks)
    translator.tag(tag).use(plugins)

    return translator
}

function detectLocale (locales: string[]) {
    const lang = navigator.language || (navigator as (Navigator & { userLanguage: string })).userLanguage
    if (!lang) return 'UNKNOWN'
    return find(locales, str => lang.match(str) !== null) || lang
}
