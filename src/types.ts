import Message from './Message'
import Translator from './Translator'

interface Mappable<V> {[name: string]: V}

export type ValueMap = Mappable<any>
export type ValueFilter = (value: any) => string | number
export type ValueFilterMap = Mappable<ValueFilter>
export type ValueFetcher = (template: string, values: ValueMap, filters: ValueFilterMap) => string

type Template = string
export type TemplateMap = Mappable<Template>
export type TemplateLocaleMap = Mappable<TemplateMap>

type MessageMap = Mappable<Message>
export type MessageLocaleMap = Mappable<MessageMap>

export type Formatter = (template: string, values: ValueMap, locale: string) => string
export type Plugin = (t: Translator) => void

export type TransOptions = Partial<{locale: string, defaults: string}>
