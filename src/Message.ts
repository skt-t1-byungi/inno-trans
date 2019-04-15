import find = require('@skt-t1-byungi/array-find')
import parsePlurals, { PluralTemplate } from './parsePlurals'

export default class Message {
    private _template: string
    private _plurals: PluralTemplate[] | null = null

    constructor (template: string) {
        this._template = String(template)
    }

    public template () {
        return this._template
    }

    public plurals () {
        return this._plurals || (this._plurals = parsePlurals(this._template))
    }

    public findPluralTemplate (num: number) {
        const plural = find(this.plurals(), (({ min, max }) => min <= num && num <= max))
        return plural ? plural.value : null
    }
}
