import Message from './Message'
import { MessageLocaleMap, TemplateMap } from './types'
import { each, entries, hasOwn } from './util'

export default class MessageRepo {
    private _repo: MessageLocaleMap = {}

    public addMessages (locale: string, templates: TemplateMap) {
        const templateEntries = entries(templates)
        if (templateEntries.length === 0) return

        const messages = this._repo[locale] || (this._repo[locale] = {})
        for (const [k, template] of templateEntries) messages[k] = new Message(template)
    }

    public getAddedLocales () {
        const locales: string[] = []
        each(this._repo, (_, locale) => locales.push(locale))
        return locales
    }

    public removeMessages (locales?: string | string[]) {
        if (locales === undefined) {
            this._repo = {}
            return
        }

        if (typeof locales === 'string') locales = [locales]
        for (const locale of locales) delete this._repo[locale]
    }

    public hasMessage (locale: string, key?: string) {
        if (!hasOwn(this._repo, locale)) return false
        if (key === undefined) return true
        return hasOwn(this._repo[locale], key)
    }

    public findMessage (locales: string[], key: string) {
        for (const locale of locales) {
            if (this.hasMessage(locale, key)) return this._repo[locale][key]
        }

        return null
    }
}
