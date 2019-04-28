export function hasOwn <T extends object> (o: T, k: string): k is Extract<keyof T, string> {
    return Object.prototype.hasOwnProperty.call(o, k)
}

export function each<T extends object> (o: T, fn: (v: T[keyof T], k: Extract<keyof T, string>) => void) {
    for (const k in o) {
        if (hasOwn(o, k)) fn(o[k], k)
    }
}

export function getProp<T extends object,K extends (keyof T & string), F> (o: T, k: K, defaults: F) {
    // tslint:disable-next-line: strict-type-predicates no-useless-cast
    if (hasOwn(o, k) && o[k] !== undefined) return o[k]!
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
