import reduce = require('@skt-t1-byungi/array-reduce')
import { ValueFetcher } from './types'
import { hasOwn } from './util'

// tslint:disable-next-line:cognitive-complexity
export default function makeFetcher (prefix: string, suffix: string): ValueFetcher {
    const regex = new RegExp(`\\\\?${escape(prefix)}\\s*([^\\s|]+?)\\s*((?:\\|\\s*[^\\s|]+\\s*)*)${escape(suffix)}`, 'g')

    return (template, values, filters, commonFilters) => {
        const replacer = (match: string, key: string, filterStr: string) => {
            if (match[0] === '\\') return match.slice(1)
            if (!hasOwn(values, key)) return ''

            const value = commonFilters.length > 0
                ? reduce(commonFilters, (v, filter) => filter(v), (values[key]))
                : values[key]

            if (!filterStr) return String(value)

            const str = reduce(
                filterStr.split('|'),
                (v, name) => hasOwn(filters, name = trim(name)) ? filters[name](v) : v,
                value)

            return String(str)
        }

        return template.replace(regex, replacer)
    }
}

function escape (str: string) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

export function trim (s: string) {
    return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}
