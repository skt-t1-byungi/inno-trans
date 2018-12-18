import Message from './Message'
import Translator from './Translator'

interface Mappable<V> {[name: string]: V}

export type ValueMap = Mappable<any>
export type ValueFilter = (value: any) => string | number
export type ValueFilterMap = Mappable<ValueFilter>
export type ValueFetcher = (
    template: string, values: ValueMap, filters: ValueFilterMap, commonFilters: ValueFilter[]) => string

type Template = string
export type TemplateMap = Mappable<Template>
export type TemplateLocaleMap = Mappable<TemplateMap>

type MessageMap = Mappable<Message>
export type MessageLocaleMap = Mappable<MessageMap>

export type Formatter = (template: string, values: ValueMap, locale: string) => string
export type Plugin = (t: ITranslator) => void

export type TransOptions = Partial<{locale: string, defaults: string}>

export interface ITranslator {
    getAddedLocales (): string[]
    hasMessage (locale: string, key?: string): boolean
    removeMessages (locales?: string | string[]): this
    addMessages (locale: string, templates: TemplateMap): this
    locale (): string
    locale (locale: string): this
    addFilter (name: string, filter: ValueFilter): this
    addFormatter (formatter: Formatter): this
    fallbacks (): string[]
    fallbacks (fallbacks: string | string[]): this
    tag ([prefix, suffix]: [string, string]): this
    trans (key: string, values?: ValueMap, opts?: TransOptions): string
    transChoice (key: string, num: number, values?: ValueMap, opts?: TransOptions): string
    use (plugins: Plugin | Plugin[]): this
}
