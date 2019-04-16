import map = require('@skt-t1-byungi/array-map')

export interface PluralTemplate {min: number, max: number, value: string}

export default function parsePlurals (str: string): PluralTemplate[] {
    const templates = str.match(/(?:({[^}]*})|(\\\|)|([^|]))+/g) || []
    const len = templates.length

    if (len <= 1) return []

    return map(templates, (template, i) => {
        return tryParseEqualType(template) || tryParseBetweenType(template) || parseIndexType(template, i, len)
    })
}

function tryParseEqualType (template: string) {
    const regex = /^\{\s*(\d+)\s*\}/

    const matched = regex.exec(template)
    if (!matched) return null

    const equalNum = parseNumber(matched[1])
    return {
        max: equalNum,
        min: equalNum,
        value: template.replace(regex, '')
    }
}

function tryParseBetweenType (template: string) {
    const regex = /^\[\s*(-?(?:\d+|\*))\s*,\s*(-?(?:\d+|\*))\s*\]/

    const matched = regex.exec(template)
    if (!matched) return null

    const [,min, max] = matched
    return {
        max: parseNumber(max),
        min: parseNumber(min),
        value: template.replace(regex, '')
    }
}

function parseIndexType (template: string, i: number, len: number) {
    return {
        max: i === len - 1 ? Infinity : i + 1,
        min: i === 0 ? -Infinity : i + 1,
        value: template
    }
}

function parseNumber (str: string) {
    switch (str) {
        case '-*':
            return -Infinity
        case '*':
            return Infinity
        default:
            return parseInt(str, 10)
    }
}
