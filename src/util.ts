export function hasOwn (o: object, k: string) {
    return Object.prototype.hasOwnProperty.call(o, k)
}

export function each<T extends object> (o: T, each: (v: T[keyof T], k: Extract<keyof T, string>) => void) {
    for (const k in o) {
        if (hasOwn(o, k)) each(o[k], k)
    }
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
