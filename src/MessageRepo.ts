import Message from './Message'
import { MessageLocaleMap, TemplateMap } from './types'
import { hasOwn } from './util'

export default class MessageRepo {
    private _repo: MessageLocaleMap = {}

    public addMessages (locale: string, templates: TemplateMap) {
        const repo = this._repo[locale] || (this._repo[locale] = {})

        for (const key in templates) {
            if (hasOwn(templates, key)) repo[key] = new Message(templates[key])
        }
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
