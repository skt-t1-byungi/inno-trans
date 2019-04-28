import reduce = require('@skt-t1-byungi/array-reduce')
import filter = require('@skt-t1-byungi/array-filter')
import EventEmitter from '@byungi/event-emitter'
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
    ValueMap,
    EventName,
    EventListener
} from './types'
import { assertType, each, getProp } from './util'

export default class Translator implements ITranslator {
    public t: <Defaults= string> (key: string, values?: ValueMap, opts?: TransOptions<Defaults>) => string | Defaults
    public tc: <Defaults= string> (key: string, num: number, values?: ValueMap, opts?: TransOptions<Defaults>) => string | Defaults

    private _emitter = new EventEmitter()
    private _messageRepo = new MessageRepo()
    private _locale!: string
    private _fetcher!: ValueFetcher
    private _fallbacks: string[] = []
    private _filters: ValueFilterMap = {}
    private _commonFilters: ValueFilter[] = []
    private _formatters: Formatter[] = []
    private _fetchFormatter: Formatter

    constructor () {
        this._fetchFormatter = (template, values) => this._fetcher(template, values, this._filters, this._commonFilters)
        this.t = (key, values, opts) => this.trans(key, values, opts)
        this.tc = (key, numb, values, opts) => this.transChoice(key, numb, values, opts)
    }

    public on (eventName: EventName, listener: EventListener) {
        this._emitter.on(eventName, listener)
        return this
    }

    public once (eventName: EventName, listener: EventListener) {
        this._emitter.once(eventName, listener)
        return this
    }

    public off (eventName: EventName, listener?: EventListener) {
        this._emitter.off(eventName, listener)
        return this
    }

    public hasEvent (eventName: EventName, listener?: EventListener) {
        this._emitter.has(eventName, listener)
        return this
    }

    private _emit (eventName: Exclude<EventName, '*'>, ...params: any[]) {
        this._emitter.emit(eventName, ...params)
        this._emitter.emit('*', eventName, ...params)
    }

    public getAddedLocales () {
        return this._messageRepo.getAddedLocales()
    }

    public hasMessage (locale: string, key?: string) {
        return this._messageRepo.hasMessage(locale, key)
    }

    public removeMessages (locale: string, key?: string) {
        if (this._messageRepo.removeMessages(locale, key)) this._emit('removeMessages', locale, key)
        return this
    }

    public addMessages (locale: string, templates: TemplateMap) {
        this._messageRepo.addMessages(locale, templates)
        this._emit('addMessages', locale)
        return this
    }

    public locale (): string
    public locale (locale: string): this
    public locale (locale?: string) {
        if (locale === undefined) return this._locale
        if (this._locale !== locale) this._emit('changeLocale', this._locale = locale)
        return this
    }

    public addFilter (name: string, filter: ValueFilter) {
        assertType('filter', filter, 'function')
        if (name === '*') {
            this._commonFilters.push(filter)
        } else {
            this._filters[name] = filter
        }
        this._emit('addFilter', name)
        return this
    }

    public removeFilter (name: string, fn?: ValueFilter) {
        if (name === '*' && this._commonFilters.length > 0) {
            if (fn) {
                assertType('filter', fn, 'function')
                this._commonFilters = filter(this._commonFilters, v => v !== fn)
            } else {
                this._commonFilters = []
            }
            this._emit('removeFilter', '*')
        } else if (this._filters[name]) {
            delete this._filters[name]
            this._emit('removeFilter', name)
        }

        return this
    }

    public addFormatter (formatter: Formatter) {
        assertType('formatter', formatter, 'function')
        this._formatters.push(formatter)
        this._emit('addFormatter')
        return this
    }

    public removeFormatter (formatter: Formatter) {
        assertType('formatter', formatter, 'function')
        this._formatters = filter(this._formatters, v => v !== formatter)
        this._emit('removeFormatter')
        return this
    }

    public fallbacks (): string[]
    public fallbacks (fallbacks: string | string[]): this
    public fallbacks (fallbacks?: string | string[]) {
        if (fallbacks === undefined) return this._fallbacks
        if (typeof fallbacks === 'string') fallbacks = [fallbacks]
        if (!equalFallbacks(this._fallbacks, fallbacks)) this._emit('changeFallbacks', this._fallbacks = fallbacks.slice())
        return this
    }

    public tag ([prefix, suffix]: [string, string]) {
        assertType('prefix', prefix, 'string')
        assertType('suffix', suffix, 'string')
        this._fetcher = makeFetcher(prefix, suffix)
        this._emit('changeTag', [prefix, suffix])
        return this
    }

    public trans <Defaults= string> (key: string, values: ValueMap = {}, opts: TransOptions<Defaults> = {}) {
        const locale = getProp(opts, 'locale', this._locale)

        const message = this._findMessage(key, locale)
        if (!message) return getProp(opts, 'defaults', key)

        return this._format(message.template(), values, locale)
    }

    public transChoice <Defaults= string> (key: string, num: number, values: ValueMap = {}, opts: TransOptions <Defaults> = {}) {
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
        const formatters = [this._fetchFormatter, escapeFormatter, ...this._formatters]
        return reduce(formatters, (str, format) => format(str, values, locale), template)
    }
}

function escapeFormatter (template: string) {
    return template.replace(/\\([[\]{}|])/g, '$1')
}

function equalFallbacks (a: string[], b: string[]) {
    if (a.length !== b.length) return false
    for (const locale of a) {
        if (b.indexOf(locale) === -1) return false
    }
    return true
}
