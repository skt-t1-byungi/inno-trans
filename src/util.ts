export function hasOwn <T extends object> (o: T, k: string): k is Extract<keyof T, string> {
    return Object.prototype.hasOwnProperty.call(o, k)
}

export function each<T extends object> (o: T, each: (v: T[keyof T], k: Extract<keyof T, string>) => void) {
    for (const k in o) {
        if (hasOwn(o, k)) each(o[k], k)
    }
}

export function getProp<T extends object> (o: T, k: string, defaults: string) {
    if (hasOwn(o, k) && typeof o[k] === 'string') return (o as Record<any, string>)[k]
    return defaults
}

export function entries<T extends object> (o: T) {
    const r: Array<[Extract<keyof T, string>, T[keyof T]]> = []
    each(o, (v, k) => r.push([k,v]))
    return r
}

export function assertType<T> (name: string, val: T, assertType: string) {
    const type = typeof val
    if (type !== assertType) {
        throw new TypeError(`Expected ${name} to be of type "${assertType}", but "${type}".`)
    }
}
