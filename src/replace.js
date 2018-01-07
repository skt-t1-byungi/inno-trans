export default function replace (text, values, [prefix, suffix]) {
  let result = text

  for (const place in values) {
    const value = values[place]

    result = result.replace(new RegExp(`${prefix}\\s*${place}\\s*${suffix}`, 'g'), value)
  }

  return result
}
