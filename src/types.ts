import Message from './Message'
import Translator from './Translator'

interface Mappable<V> {[name: string]: V}
type Value = string | number

export type ValueMap = Mappable<Value>
export type ValueFilter = (str: Value) => Value
export type ValueFilterMap = Mappable<ValueFilter>
export type ValueFetcher = (template: string, values: ValueMap, filters: ValueFilterMap) => string

type Template = string
export type TemplateMap = Mappable<Template>
export type TemplateLocaleMap = Mappable<TemplateMap>

type MessageMap = Mappable<Message>
export type MessageLocaleMap = Mappable<MessageMap>

export type Formatter = (template: string, values: ValueMap, locale: string) => string
export type Plugin = (t: Translator) => void
