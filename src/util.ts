export function hasOwn (o: object, k: string) {
    return Object.prototype.hasOwnProperty.call(o, k)
}

export function assertType<T> (name: string, val: T, assertType: string) {
    const type = typeof val
    if (type !== assertType) {
        throw new TypeError(`Expected ${name} to be of type "${assertType}", but "${type}".`)
    }
}
