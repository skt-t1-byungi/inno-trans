import find = require('@skt-t1-byungi/array-find')

export default function detectLocale (locales: string[]) {
    let lang: string | void
    if (process && process.env) {
        lang = process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE
    } else if (navigator) {
        lang = navigator.language || (navigator as (Navigator & { userLanguage: string })).userLanguage
    }

    if (!lang) return 'UNKNOWN'

    return find(locales, str => (lang as string).match(str) !== null) || lang
}
