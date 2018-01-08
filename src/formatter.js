import replace from './replace'

export function fetchValuesFormatter (template, values, locale, tag) {
  return replace(template, values, tag)
}
