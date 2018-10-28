import filter from '@skt-t1-byungi/array-filter'
import Message from './Message'
import { MessageLocaleMap, TemplateMap } from './types'
import { each, entries, hasOwn } from './util'

export default class MessageRepo {
    private _repo: MessageLocaleMap = {}

    public addMessages (locale: string, templates: TemplateMap) {
        const templateEntries = entries(templates)
        if (templateEntries.length === 0) return 0

        const messages = this._repo[locale] || (this._repo[locale] = {})
        for (const [k, template] of templateEntries) messages[k] = new Message(template)

        return templateEntries.length
    }

    public getAddedLocales () {
        const locales: string[] = []
        each(this._repo, (_, locale) => locales.push(locale))
        return locales
    }

    public removeMessages (locales?: string | string[]): string[] {
        if (locales === undefined) {
            const removes = this.getAddedLocales()
            this._repo = {}
            return removes
        }

        if (typeof locales === 'string') {
            if (!this.hasLocale(locales)) return []
            delete this._repo[locales]
            return [locales]
        }

        locales = filter(locales, locale => this.hasLocale(locale))
        for (const locale of locales) delete this._repo[locale]

        return locales
    }

    public hasLocale (locale: string) {
        return hasOwn(this._repo, locale)
    }

    public findMessage (locales: string[], key: string) {
        for (const locale of locales) {
            if (!this.hasLocale(locale)) continue

            const messages = this._repo[locale]
            if (hasOwn(messages, key)) return messages[key]
        }

        return null
    }
}
