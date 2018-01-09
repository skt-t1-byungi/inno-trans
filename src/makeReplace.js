function escape (str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

export default function makeReplace (prefix, suffix) {
  const regex = new RegExp(`${escape(prefix)}\\s*(\\w+)\\s*((?:\\|\\s*\\w*\\s*)*)${escape(suffix)}`, 'g')

  return (text, values, filters) => {
    const changed = text.replace(regex, (match, key, filterExpr) => {
      if (!values.hasOwnProperty(key)) {
        return match
      }

      return filterExpr.split('|')
        .map(v => v.trim())
        .filter(name => filters.hasOwnProperty(name))
        .reduce((value, name) => filters[name](value), values[key])
    })

    return changed
  }
}
