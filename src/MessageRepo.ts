import reduce from '@skt-t1-byungi/array-reduce'
import Message from './Message'
import { MessageLocaleMap, TemplateMap } from './types'
import { each, hasOwn } from './util'

export default class MessageRepo {
    private _repo: MessageLocaleMap = {}

    public addMessages (locale: string, templates: TemplateMap) {
        const messages = this._repo[locale] || (this._repo[locale] = {})
        each(templates, (template, key) => (messages[key] = new Message(template)))
    }

    public getLocales () {
        const repo = this._repo
        const locales: string[] = []
        each(repo, (_, locale) => locales.push(locale))
        return locales
    }

    public removeMessages (locales?: string | string[]): string[] {
        if (!locales) {
            const targets = this.getLocales()
            this._repo = {}
            return targets
        }

        if (typeof locales === 'string') {
            if (!this.hasLocale(locales)) return []
            delete this._repo[locales]
            return [locales]
        }

        return reduce(locales, (acc, locale) => acc.concat(this.removeMessages(locale)), [] as string[])
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
