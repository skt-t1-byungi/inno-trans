import reduce from '@skt-t1-byungi/array-reduce'
import Message from './Message'
import { MessageLocaleMap, TemplateMap } from './types'
import { hasOwn } from './util'

export default class MessageRepo {
    private _repo: MessageLocaleMap = {}

    public addMessages (locale: string, templates: TemplateMap) {
        const messages = this._repo[locale] || (this._repo[locale] = {})

        for (const key in templates) {
            if (hasOwn(templates, key)) messages[key] = new Message(templates[key])
        }
    }

    public getLocales () {
        const repo = this._repo
        const locales = []
        for (const k in repo) {
            if (hasOwn(repo, k)) locales.push(k)
        }
        return locales
    }

    public removeMessages (locale?: string | string[]): string[] {
        if (!locale) {
            const targets = this.getLocales()
            this._repo = {}
            return targets
        }

        if (typeof locale === 'string') {
            if (!this.hasLocale(locale)) return []
            delete this._repo[locale]
            return [locale]
        }

        return reduce(locale, (acc, item) => acc.concat(this.removeMessages(item)), [] as string[])
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
