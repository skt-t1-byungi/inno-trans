import find from '@skt-t1-byungi/array-find'
import Translator from './Translator'
import { Formatter, Plugin, TemplateLocaleMap, ValueFilterMap } from './types'
import { each } from './util'

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
    const locales: string[] = []

    each(message, (templates, locale) => {
        locales.push(locale)
        translator.message(locale, templates)
    })

    each(filter, (filter, name) => translator.filter(name, filter))
    for (const fn of formatter) translator.formatter(fn)

    return translator
        .locale(locale || detectLocale(locales))
        .fallback(fallback)
        .tag(tag)
        .use(plugin)
}

function detectLocale (locales: string[]) {
    const lang = navigator.language || (navigator as (Navigator & { userLanguage: string })).userLanguage
    return find(locales, str => lang.match(str) !== null) || lang
}
