import fs from 'fs'
import path from 'path'
import {isHidden} from 'is-hidden'
import {iso6393} from 'iso-639-3'
import {speakers} from 'speakers'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import gfm from 'remark-gfm'
import stringify from 'remark-stringify'
import {u} from 'unist-builder'
import {selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'
import parseAuthor from 'parse-author'
import alphaSort from 'alpha-sort'
import {udhr} from 'udhr'
import {min} from 'trigrams'
import unicode from '@unicode/unicode-14.0.0'
import {customFixtures} from './custom-fixtures.js'
import {udhrOverrides} from './udhr-overrides.js'
import {udhrExclude} from './udhr-exclude.js'

const own = {}.hasOwnProperty

const ascending = alphaSort()
const scripts = unicode.Script

const core = process.cwd()
const root = path.join(core, 'packages')
const mono = JSON.parse(fs.readFileSync('package.json'))

/* Persian (fas, macrolanguage) contains Western Persian (pes)
 * and Dari (prs).  They’re so similar in UDHR that using both
 * will result in incorrect results, so add the macrolanguage
 * instead. (note: prs and pes are ignored) */
speakers.fas = speakers.prs + speakers.pes

main()

// eslint-disable-next-line complexity
async function main() {
  const trigrams = await min()
  const expressions = await createExpressions()
  const topLanguages = createTopLanguages()
  const doc = fs.readFileSync(path.join(root, 'franc', 'index.js'), 'utf8')
  const files = fs.readdirSync(root)
  let index = -1

  while (++index < files.length) {
    const basename = files[index]

    if (isHidden(basename)) continue

    const base = path.join(root, basename)
    const pack = JSON.parse(fs.readFileSync(path.join(base, 'package.json')))
    const threshold = pack.threshold
    const support = []
    const regularExpressions = {} /* Ha! */
    const perScript = {}
    const data = {}
    let list = topLanguages

    if (!threshold) {
      return
    }

    console.log()
    console.log('%s, threshold: %s', pack.name, threshold)

    if (threshold !== -1) {
      list = list.filter((info) => {
        return info.speakers >= threshold
      })
    }

    const byScript = {}
    let offset = -1

    while (++offset < list.length) {
      const info = list[offset]
      const script = info.script

      if (!byScript[script]) {
        byScript[script] = []
      }

      byScript[script].push(info)
    }

    let script

    for (script in byScript) {
      if (own.call(byScript, script)) {
        const languages = byScript[script].filter((info) => {
          return ![
            /* Ignore `npi` (Nepali (individual language)): `npe`
             * (Nepali (macrolanguage)) is also included. */
            'npi',
            /* Ignore non-Mandarin Chinese, if all are turned on, they’ll get
             * ignored, as trigrams don’t work on Han characters (cmn has 830m
             * speakers, so that’s the preferred choice). */
            'yue',
            'cjy',
            'gan',
            'nan',
            'wuu',
            'hak'
          ].includes(info.iso6393)
        })

        if (languages.length > 1) {
          if (!regularExpressions[script]) {
            regularExpressions[script] = expressions[script]
          }

          perScript[script] = languages
        } else {
          support.push(languages[0])
          regularExpressions[languages[0].iso6393] = expressions[script]
        }
      }
    }

    for (script in perScript) {
      if (own.call(perScript, script)) {
        const scripts = perScript[script]
        const scriptObject = {}
        let index = -1

        data[script] = scriptObject

        while (++index < scripts.length) {
          const info = scripts[index]

          if (trigrams[info.udhr]) {
            support.push(info)
            scriptObject[info.iso6393] = trigrams[info.udhr]
              .concat()
              .reverse()
              .join('|')
          } else {
            console.log(
              '  Ignoring language without trigrams: %s (%s, %s)',
              info.iso6393,
              info.name,
              script
            )
          }
        }
      }
    }

    /* Push Japanese.
     * Unicode Kanji Table from http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml */
    const kanjiRegexSource = '[\u3400-\u4DB5\u4E00-\u9FAF]'
    regularExpressions.jpn = new RegExp(
      expressions.Hiragana.source +
        '|' +
        expressions.Katakana.source +
        '|' +
        kanjiRegexSource,
      'g'
    )

    support.sort(sort)

    fs.writeFileSync(
      path.join(base, 'expressions.js'),
      generateExpressions(regularExpressions)
    )

    fs.writeFileSync(
      path.join(base, 'data.js'),
      'export const data = ' + JSON.stringify(data, null, 2) + '\n'
    )

    fs.writeFileSync(
      path.join(base, 'readme.md'),
      generateReadme(pack, support)
    )

    if (pack.name !== mono.name) {
      fs.writeFileSync(
        path.join(base, 'index.js'),
        '// This file is generated by `build.js`\n' + doc
      )
    }

    console.log('✓ %s w/ %s languages', pack.name, list.length)

    if (pack.name !== mono.name) {
      return
    }

    console.log()
    console.log('Creating fixtures')

    const fixtures = {}
    offset = -1

    while (++offset < support.length) {
      const language = support[offset]
      const udhrKey = language.udhr || language.iso6393
      let fixture

      if (udhrKey in customFixtures) {
        fixture = customFixtures[udhrKey]
      } else if (udhrKey) {
        const info = udhr.find((d) => d.code === udhrKey)

        if (info) {
          const declaration = String(
            fs.readFileSync(
              path.join(
                'node_modules',
                'udhr',
                'declaration',
                udhrKey + '.html'
              )
            )
          )
          const tree = unified().use(rehypeParse).parse(declaration)

          fixture =
            selectAll('header p', tree)
              .map((d) => toString(d))
              .join(' ') ||
            selectAll(
              'body > :matches(h1, h2, h3, h4, h5, h6), header :matches(h1, h2, h3, h4, h5, h6)',
              tree
            )
              .map((d) => toString(d))
              .join(' ')
        }
      }

      if (!fixture) {
        console.log(
          '  Could not access preamble or note for `%s` (%s). No fixture is generated.',
          language.iso6393,
          udhrKey
        )

        fixture = ''
      }

      fixtures[udhrKey] = {
        iso6393: language.iso6393,
        fixture: fixture.slice(0, 1000)
      }
    }

    fs.writeFileSync(
      path.join(core, 'test', 'fixtures.js'),
      'export const fixtures = ' + JSON.stringify(fixtures, null, 2) + '\n'
    )

    console.log('✓ fixtures')
  }

  function generateExpressions(expressions) {
    return [
      '// This file is generated by `build.js`.',
      'export const expressions = {',
      '  ' +
        Object.keys(expressions)
          .map((script) => {
            return script + ': ' + expressions[script]
          })
          .join(',\n  '),
      '}',
      ''
    ].join('\n')
  }

  function generateReadme(pack, list) {
    const counts = count(list)
    const threshold = pack.threshold
    const licensee = parseAuthor(pack.author)
    const tree = u('root', [
      u('html', '<!--This file is generated by `build.js`-->'),
      u('heading', {depth: 1}, [u('text', pack.name)]),
      u('blockquote', [u('paragraph', [u('text', pack.description + '.')])]),
      u('paragraph', [
        u(
          'text',
          'Built with support for ' +
            list.length +
            ' languages' +
            (threshold === -1
              ? ''
              : ' (' +
                threshold.toLocaleString('en', {notation: 'compact'}) +
                ' or more speakers)') +
            '.'
        )
      ]),
      u('paragraph', [
        u('text', 'View the '),
        u('link', {url: mono.repository}, [u('text', 'monorepo')]),
        u('text', ' for more packages and\nusage information.')
      ]),
      u('heading', {depth: 2}, [u('text', 'Install')]),
      u('paragraph', [u('text', 'npm:')]),
      u('code', {lang: 'sh'}, 'npm install ' + pack.name),
      u('heading', {depth: 2}, [u('text', 'Support')]),
      u('paragraph', [
        u('text', 'This build supports the following languages:')
      ]),
      u('table', {align: []}, [header()].concat(list.map((d) => row(d)))),
      u('heading', {depth: 2}, [u('text', 'License')]),
      u('paragraph', [
        u('link', {url: mono.repository + '/blob/main/license'}, [
          u('text', mono.license)
        ]),
        u('text', ' © '),
        u('link', {url: licensee.url}, [u('text', licensee.name)])
      ])
    ])

    return unified().use(stringify).use(gfm).stringify(tree)

    function row(info) {
      return u('tableRow', [
        u('tableCell', [
          u(
            'link',
            {
              url:
                'http://www-01.sil.org/iso639-3/documentation.asp?id=' +
                info.iso6393,
              title: null
            },
            [u('inlineCode', info.iso6393)]
          )
        ]),
        u('tableCell', [
          u(
            'text',
            info.name +
              (counts[info.iso6393] === 1 ? '' : ' (' + info.script + ')')
          )
        ]),
        u('tableCell', [
          u(
            'text',
            typeof info.speakers === 'number'
              ? info.speakers.toLocaleString('en', {
                  notation: 'compact',
                  maximumFractionDigits: 0
                })
              : 'unknown'
          )
        ])
      ])
    }

    function header() {
      return u('tableRow', [
        u('tableCell', [u('text', 'Code')]),
        u('tableCell', [u('text', 'Name')]),
        u('tableCell', [u('text', 'Speakers')])
      ])
    }
  }

  function count(list) {
    const map = {}
    let index = -1

    while (++index < list.length) {
      const info = list[index]
      map[info.iso6393] = (map[info.iso6393] || 0) + 1
    }

    return map
  }

  /* Get which scripts are used for a given UDHR code. */
  function scriptInformation(code) {
    const info = code ? udhr.find((d) => d.code === code) : undefined
    let paragraphs = ''

    if (info) {
      const declaration = fs.readFileSync(
        path.join('node_modules', 'udhr', 'declaration', code + '.html')
      )
      const tree = unified().use(rehypeParse).parse(declaration)
      paragraphs = selectAll('article p', tree)
        .map((d) => toString(d))
        .join(' ')
    }

    const length = paragraphs.length
    const result = {}
    let script

    for (script in expressions) {
      if (
        own.call(expressions, script) &&
        // Ignore scripts unimportant for our goal.
        script !== 'Common' &&
        script !== 'Inherited'
      ) {
        const countMatch = paragraphs.match(expressions[script])
        const count =
          Math.round(((countMatch ? countMatch.length : 0) / length) * 100) /
          100

        if (count && count > 0.05) {
          result[script] = count
        }
      }
    }

    return result
  }

  /* Sort a list of languages by most-popular. */
  function sort(a, b) {
    return (
      (b.speakers || 0) - (a.speakers || 0) ||
      ascending(a.name, b.name) ||
      ascending(a.script, b.script)
    )
  }

  function createTopLanguages() {
    const topWithUdhr = []
    let index = -1

    while (++index < iso6393.length) {
      const info = Object.assign({}, iso6393[index], {
        speakers: speakers[iso6393[index].iso6393]
      })

      const code = info.iso6393
      const name = info.name

      if (udhrExclude.includes(code)) {
        console.log('Ignoring unsafe language `%s` (%s)', code, name)
        continue
      }

      if (info.type === 'special') {
        console.log('Ignoring special code `%s` (%s)', code, name)
        continue
      }

      const udhrs = getUdhrKeysfromIso(code)

      topWithUdhr.push(info)
      // Could be undefined: keep at least one for later.
      info.udhr = udhrs.pop()

      if (udhrs.length > 0) {
        let index = -1
        while (++index < udhrs.length) {
          topWithUdhr.push(Object.assign({}, info, {udhr: udhrs[index]}))
        }
      }
    }

    const topWithScript = []
    index = -1

    while (++index < topWithUdhr.length) {
      const info = topWithUdhr[index]
      const code = info.iso6393
      let scripts = Object.keys(scriptInformation(info.udhr))

      /* Languages without (accessible) UDHR declaration.
       * No trigram, and no custom script, available for:
       * - awa (Awadhi): Devanagari, Kaithi, Persian;
       * - snd (Sindhi): Arabic, Devanagari, Khudabadi, and more;
       * - hne (Chhattisgarhi): Devanagari;
       * - asm (Assamese): Assamese (Bengali + two other characters*);
       * - koi (Komi-Permyak): Cyrillic;
       * - raj (Rajasthani): Devanagari;
       * - mve (Marwari): Devanagari, and Mahajani (which is in unicode*);
       * - bjj (Kanauji): Devanagari;
       * - kmr (Northern Kurdish): Latin (main); Perso-Arabic;
       * - kas (Kashmiri): Perso-Arabic, Devanagari, Sharada.
       * - shn (Shan): A Shan script exists, but nearly no one can read it*.
       * - gbm (Garhwali): Devanagari
       * - dyu (Dyula): N'Ko, Latin, Arabic
       * - ksw (S'gaw Karen): Burmese
       * - gno (Northern Gondi): Devanagari, Telugu
       * - bgp (Eastern Balochi): Urdu Arabic, Arabic
       * - unr (Mundari): ?
       * - hoc (Ho): Ol Chiki, Devanagari, Varang Kshiti
       * - pwo (Pwo Western Karen): Burmese
       *
       * *: future interest?
       */
      switch (code) {
        case 'tel': {
          scripts = ['Telugu']
          break
        }

        case 'ori': {
          scripts = ['Oriya']
          break
        }

        case 'sin': {
          scripts = ['Sinhala']
          break
        }

        case 'sat': {
          scripts = ['Ol_Chiki']
          break
        }

        case 'jpn': {
          /* Japanese is different. */
          scripts = ['Hiragana, Katakana, and Han']
          break
        }

        // No default
      }

      if (scripts.length > 1) {
        throw new Error(
          'Woops, I found a language which uses more than one script. Franc is not build for that. Exiting.'
        )
      }

      if (scripts.length === 0 && !(info.udhr in trigrams)) {
        if (info.speakers && info.speakers > 1e6) {
          console.log(
            'Ignoring language with neither trigrams nor scripts: %s (%s, %s)',
            code,
            info.name,
            info.speakers.toLocaleString('en', {notation: 'compact'})
          )
        }

        continue
      }

      topWithScript.push({...info, script: scripts})
    }

    return topWithScript.sort(sort)
  }
}

/* Get UDHR codes for an ISO6393 code. */
function getUdhrKeysfromIso(iso) {
  const udhrs = []

  if (iso in udhrOverrides) {
    return udhrOverrides[iso]
  }

  let index = -1

  while (++index < udhr.length) {
    const info = udhr[index]

    // To do: use a better detection algorithm (UDHR declarations have a `data-iso6393` field)
    if (info.iso6393 === iso || info.code === iso) {
      udhrs.push(info.code)
    }
  }

  if (udhrs.length === 1) {
    return udhrs
  }

  /* Pick the main UDHR. */
  if (udhrs.includes(iso)) {
    return [iso]
  }

  return udhrs
}

async function createExpressions() {
  const result = {}

  await Promise.all(
    scripts.map((script) =>
      import('@unicode/unicode-14.0.0/Script/' + script + '/regex.js').then(
        (mod) => {
          result[script] = new RegExp(mod.default.source, 'g')
        }
      )
    )
  )

  return result
}
