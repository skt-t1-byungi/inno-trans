import find = require('@skt-t1-byungi/array-find')

export default function detectLocale (locales: string[]) {
    let lang: string | undefined
    if (process && process.env) {
        lang = process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE
    } else if (navigator) {
        lang = (navigator.language || (navigator as (Navigator & { userLanguage: string })).userLanguage)
    }

    if (lang) {
        lang = lang.toLowerCase()
        const found = find(locales, str => lang!.match(str.toLowerCase()) !== null)
        if (found) return found
    }

    return locales.length > 1 ? locales[0] : 'unknown'
}
