import replace from './replace'

export function fetchValuesFilter (template, values, locale, tag) {
  return replace(template, values, tag)
}
