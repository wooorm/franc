import fs from 'node:fs/promises'
import {iso6393} from 'iso-639-3'
import {fetch} from 'undici'

/** @type {Record<string, string>} */
const iso6393ToName = {}

let index = -1

while (++index < iso6393.length) {
  const language = iso6393[index]
  iso6393ToName[language.iso6393] = language.name
}

const response = await fetch(
  'https://raw.githubusercontent.com/wooorm/franc/main/test/fixtures.js'
)
const body = await response.text()

await fs.writeFile(new URL('src/fixtures.js', import.meta.url), body)

await fs.writeFile(
  new URL('src/to-name.js', import.meta.url),
  [
    '/** @type {Record<string, string>} */',
    'export const toName = ' + JSON.stringify(iso6393ToName, undefined, 2),
    ''
  ].join('\n')
)
