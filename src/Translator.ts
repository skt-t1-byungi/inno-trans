import reduce from '@skt-t1-byungi/array-reduce'
import makeFetcher from './makeFetcher'
import MessageRepo from './MessageRepo'
import {
    Formatter,
    ITranslator,
    Plugin,
    TemplateMap,
    TransOptions,
    ValueFetcher,
    ValueFilter,
    ValueFilterMap,
    ValueMap
} from './types'
import { assertType, each, getProp } from './util'

export default class Translator implements ITranslator {
    public t: (key: string, values?: ValueMap, opts?: TransOptions) => string
    public tc: (key: string, num: number, values?: ValueMap, opts?: TransOptions) => string

    private _messageRepo = new MessageRepo()
    private _locale!: string
    private _fetcher!: ValueFetcher
    private _fallbacks: string[] = []
    private _filters: ValueFilterMap = {}
    private _commonFilters: ValueFilter[] = []
    private _formatters: Formatter[] = []
    private _fetchFormatter: Formatter

    constructor () {
        this._fetchFormatter = (template, values) => this._fetcher(template, values, this._filters)
        this.t = (key, values, opts) => this.trans(key, values, opts)
        this.tc = (key, numb, values, opts) => this.transChoice(key, numb, values, opts)
    }

    public getAddedLocales () {
        return this._messageRepo.getAddedLocales()
    }

    public hasMessage (locale: string, key?: string) {
        return this._messageRepo.hasMessage(locale, key)
    }

    public removeMessages (locales ?: string | string[]) {
        this._messageRepo.removeMessages(locales)
        return this
    }

    public addMessages (locale: string, templates: TemplateMap) {
        this._messageRepo.addMessages(locale, templates)
        return this
    }

    public locale (): string
    public locale (locale: string): this
    public locale (locale?: string) {
        if (locale === undefined) return this._locale
        this._locale = locale
        return this
    }

    public addFilter (name: string, filter: ValueFilter) {
        assertType('filter', filter, 'function')
        if (name === '*') {
            this._commonFilters.push(filter)
        } else {
            this._filters[name] = filter
        }
        return this
    }

    public addFormatter (formatter: Formatter) {
        assertType('formatter', formatter, 'function')
        this._formatters.push(formatter)
        return this
    }

    public fallbacks (): string[]
    public fallbacks (fallbacks: string | string[]): this
    public fallbacks (fallbacks?: string | string[]) {
        if (fallbacks === undefined) return this._fallbacks
        if (typeof fallbacks === 'string') fallbacks = [fallbacks]
        this._fallbacks = fallbacks.slice(0)
        return this
    }

    public tag ([prefix, suffix]: [string, string]) {
        assertType('prefix', prefix, 'string')
        assertType('suffix', suffix, 'string')
        this._fetcher = makeFetcher(prefix, suffix)
        return this
    }

    public trans (key: string, values: ValueMap = {}, opts: TransOptions = {}) {
        const locale = getProp(opts, 'locale', this._locale)

        const message = this._findMessage(key, locale)
        if (!message) return getProp(opts, 'defaults', key)

        return this._format(message.template(), values, locale)
    }

    public transChoice (key: string, num: number, values: ValueMap = {}, opts: TransOptions = {}) {
        const locale = getProp(opts, 'locale', this._locale)

        const message = this._findMessage(key, locale)
        if (!message) return getProp(opts, 'defaults', key)

        const template = message.findPluralTemplate(num)
        if (template === null) return getProp(opts, 'defaults', key)

        return this._format(template, values, locale)
    }

    public use (plugins: Plugin | Plugin[]) {
        if (typeof plugins === 'function') plugins = [plugins]
        for (const plugin of plugins) plugin(this)
        return this
    }

    private _findMessage (key: string, locale: string) {
        return this._messageRepo.findMessage([locale, ...this._fallbacks], key)
    }

    private _format (template: string, values: ValueMap, locale: string) {
        values = this._applyCommonFilters(values)
        const formatters = [this._fetchFormatter, escapeFormatter, ...this._formatters]
        return reduce(formatters, (str, format) => format(str, values, locale), template)
    }

    private _applyCommonFilters (values: ValueMap) {
        if (this._commonFilters.length === 0) return values

        const newValues: ValueMap = {}
        each(values, (val, k) => {
            newValues[k] = reduce(this._commonFilters, (v, filter) => filter(v), val)
        })
        return newValues
    }
}

function escapeFormatter (template: string) {
    return template.replace(/\\([[\]{}|])/g, '$1')
}
