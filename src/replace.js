export default function replace (text, data, [prefix, suffix]) {
  let result = text

  for (const place in data) {
    const value = data[place]

    result = result.replace(new RegExp(`${prefix}\\s*${place}\\s*${suffix}`, 'g'), value)
  }

  return result
}
