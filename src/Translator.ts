import forEach from '@skt-t1-byungi/array-for-each'
import includes from '@skt-t1-byungi/array-includes'
import reduce from '@skt-t1-byungi/array-reduce'
import EventEmitter from '@skt-t1-byungi/event-emitter'
import makeFetcher from './makeFetcher'
import MessageRepo from './MessageRepo'
import { Formatter, Plugin, TemplateMap, ValueFetcher, ValueFilter, ValueFilterMap, ValueMap } from './types'
import { assertType } from './util'

type TransOptions = Partial<{locale: string, defaults: string}>
type TranslatorEvents = 'init' | 'add' | 'change'

export default class Translator {
    public t: (key: string, values: ValueMap, opts: TransOptions) => string
    public tc: (key: string, num: number, values: ValueMap, opts: TransOptions) => string

    private _messageRepo = new MessageRepo()
    private _emitter = new EventEmitter()
    private _initted = false
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

    public on (evtName: TranslatorEvents, listener: () => void) {
        this._emitter.on(evtName, listener)
        return this
    }

    public once (evtName: TranslatorEvents, listener: () => void) {
        this._emitter.once(evtName, listener)
        return this
    }

    public off (evtName: TranslatorEvents, listener?: () => void) {
        this._emitter.off(evtName, listener)
        return this
    }

    public message (locale: string, templates: TemplateMap) {
        this._messageRepo.addMessages(locale, templates)

        if (!this._initted && locale === this._locale) {
            this._initted = true
            this._emitter.emit('init')
        }

        this._emitter.emit('add', locale)
        return this
    }

    public locale (locale: string) {
        this._locale = locale
        if (this._initted) this._emitter.emit('change', locale)
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
