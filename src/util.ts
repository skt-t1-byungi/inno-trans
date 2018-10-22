export function hasOwn (o: object, k: string) {
    return Object.prototype.hasOwnProperty.call(o, k)
}

export function each<T extends object> (o: T, each: (v: T[keyof T], k: string) => void) {
    for (const k in o) {
        if (hasOwn(o, k)) each(o[k], k)
    }
}

export function assertType<T> (name: string, val: T, assertType: string) {
    const type = typeof val
    if (type !== assertType) {
        throw new TypeError(`Expected ${name} to be of type "${assertType}", but "${type}".`)
    }
}
