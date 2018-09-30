import Message from './Message'
import Translator from './Translator'

export type Value = string | number
export type ValueMap = Record<string, Value>
export type ValueFilter = (str: Value) => Value
export type ValueFilterMap = Record<string, ValueFilter>
export type ValueFetcher = (template: string, values: ValueMap, filters: ValueFilterMap) => string

export type Template = string
export type TemplateMap = Record<string, Template>
export type TemplateLocaleMap = Record<string, TemplateMap>

export type Formatter = (template: string, values: ValueMap, locale: string) => string

export type MessageMap = Record<string, Message>
export type MessageLocaleMap = Record<string, MessageMap>

export type Plugin = (t: Translator) => void
