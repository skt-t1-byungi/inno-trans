import forEach from '@skt-t1-byungi/array-for-each'
import includes from '@skt-t1-byungi/array-includes'
import reduce from '@skt-t1-byungi/array-reduce'
import EventEmitter from '@skt-t1-byungi/event-emitter'
import makeFetcher from './makeFetcher'
import MessageRepo from './MessageRepo'
import { Formatter, Plugin, TemplateMap, ValueFetcher, ValueFilter, ValueFilterMap, ValueMap } from './types'
import { assertType } from './util'

type TransOptions = Partial<{locale: string, defaults: string}>
type TranslatorEvents = 'load' | 'add' | 'remove' | 'change'

export default class Translator {
    public t: (key: string, values: ValueMap, opts: TransOptions) => string
    public tc: (key: string, num: number, values: ValueMap, opts: TransOptions) => string

    private _messageRepo = new MessageRepo()
    private _emitter = new EventEmitter()
    private _loaded = false
    private _locale!: string
    private _fetcher!: ValueFetcher
    private _fallbacks: string[] = []
    private _filters: ValueFilterMap = {}
    private _formatters: Formatter[] = []
    private _fetchFormatter: Formatter

    constructor () {
        this._fetchFormatter = (template, values) => this._fetcher(template, values, this._filters)
        this.t = (key, values, opts) => this.trans(key, values, opts)
        this.tc = (key, numb, values, opts) => this.transChoice(key, numb, values, opts)
    }

    public on (evtName: 'load', listener: () => void): this
    public on (evtName: 'add' | 'change', listener: (locale: string) => void): this
    public on (evtName: 'remove', listener: (locales: string[]) => void): this
    public on (evtName: TranslatorEvents, listener: (v?: any) => void) {
        if (evtName === 'load' && this.isLoaded()) {
            listener()
        } else {
            this._emitter.on(evtName, listener)
        }
        return this
    }

    public once (evtName: 'load', listener: () => void): this
    public once (evtName: 'add' | 'change', listener: (locale: string) => void): this
    public once (evtName: 'remove', listener: (locales: string[]) => void): this
    public once (evtName: TranslatorEvents, listener: (v?: any) => void) {
        if (evtName === 'load' && this.isLoaded()) {
            listener()
        } else {
            this._emitter.once(evtName, listener)
        }
        return this
    }

    public off (evtName: TranslatorEvents, listener?: () => void) {
        this._emitter.off(evtName, listener)
        return this
    }

    public getLocales () {
        return this._messageRepo.getLocales()
    }

    public isLoaded () {
        return this._loaded
    }

    public removeMessage (locale?: string | string[]) {
        const locales = this._messageRepo.removeMessages(locale)
        if (locales.length > 0) this._emitter.emit('remove', locales)
        return this
    }

    public message (locale: string, templates: TemplateMap) {
        const hasLocale = this._messageRepo.hasLocale(locale)
        this._messageRepo.addMessages(locale, templates)
        this._emitter.emit('add', locale)
        if (!hasLocale && locale === this._locale) this._emitLocaleChange(locale)
        return this
    }

    public locale (locale: string) {
        if (locale === this._locale) return this

        this._locale = locale
        if (this._messageRepo.hasLocale(locale)) this._emitLocaleChange(locale)

        return this
    }

    public filter (name: string, filter: ValueFilter) {
        assertType('filter', filter, 'function')
        this._filters[name] = filter
        return this
    }

    public formatter (formatter: Formatter) {
        assertType('formatter', formatter, 'function')
        this._formatters.push(formatter)
        return this
    }

    public fallback (fallbacks: string | string[]) {
        if (typeof fallbacks === 'string') fallbacks = [fallbacks]

        for (const fallback of fallbacks) {
            if (!includes(this._fallbacks, fallback)) this._fallbacks.push(fallback)
        }

        return this
    }

    public tag ([prefix, suffix]: [string, string]) {
        assertType('prefix', prefix, 'string')
        assertType('suffix', suffix, 'string')
        this._fetcher = makeFetcher(prefix, suffix)
        return this
    }

    public trans (key: string, values: ValueMap = {}, opts: TransOptions = {}) {
        const locale = opts.locale || this._locale

        const message = this._findMessage(key, locale)
        if (!message) return opts.defaults || key

        return this._format(message.template(), values, locale)
    }

    public transChoice (key: string, num: number, values: ValueMap = {}, opts: TransOptions = {}) {
        const locale = opts.locale || this._locale

        const message = this._findMessage(key, locale)
        if (!message) return opts.defaults || key

        const template = message.findPluralTemplate(num)
        if (!template) return opts.defaults || key

        return this._format(template, values, locale)
    }

    public use (plugins: Plugin | Plugin[]) {
        if (typeof plugins === 'function') plugins = [plugins]
        forEach(plugins, plugin => plugin(this))
        return this
    }

    private _emitLocaleChange (locale: string) {
        if (this._loaded) {
            this._emitter.emit('change', locale)
        } else {
            this._loaded = true
            this._emitter.emit('load')
        }
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
