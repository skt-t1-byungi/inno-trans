import find from '@skt-t1-byungi/array-find'
import Translator from './Translator'
import { Formatter, ITranslator, Plugin, TemplateLocaleMap, ValueFilterMap } from './types'
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

const registeredPlugins: Plugin[] = []

export = InnoTrans

function InnoTrans ({
    locale,
    messages = {},
    fallbacks = [],
    filters = {},
    tag = ['{', '}'],
    formatters = [],
    plugins = []
}: Partial<TranslatorOptions> = {}): ITranslator {
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
    translator.tag(tag).use(registeredPlugins.concat(plugins))

    return translator
}

InnoTrans.use = (plugin: Plugin) => {
    registeredPlugins.push(plugin)
    return InnoTrans
}

function detectLocale (locales: string[]) {
    let lang: string | void
    if (process && process.env) {
        lang = process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE
    } else if (navigator) {
        lang = navigator.language || (navigator as (Navigator & { userLanguage: string })).userLanguage
    }

    if (!lang) return 'UNKNOWN'

    return find(locales, str => (lang as string).match(str) !== null) || lang
}
