#!/usr/bin/env node
/**
 * @typedef {import('franc').Options} Options
 */

import process from 'node:process'
import fs from 'node:fs/promises'
import meow from 'meow'
import {franc, francAll} from 'franc'

/** @type {Record<string, unknown> & {bin: Record<string, string>}} */
const pack = JSON.parse(
  String(await fs.readFile(new URL('package.json', import.meta.url)))
)

const command = Object.keys(pack.bin)[0]

const cli = meow(help(), {
  importMeta: import.meta,
  flags: {
    all: {
      type: 'boolean',
      alias: 'a'
    },
    whitelist: {
      type: 'string',
      alias: 'w'
    },
    only: {
      type: 'string',
      alias: 'o'
    },
    blacklist: {
      type: 'string',
      alias: 'b'
    },
    ignore: {
      type: 'string',
      alias: 'i'
    },
    minLength: {
      type: 'string',
      alias: 'm'
    },
    version: {
      type: 'boolean',
      alias: 'v'
    },
    help: {
      type: 'boolean',
      alias: 'h'
    }
  }
})

const value = cli.input.join(' ').trim()
const flags = cli.flags

/** @type {Options} */
const options = {
  minLength: Number(flags.minLength) || undefined,
  // @ts-expect-error: legacy.
  whitelist: list(flags.whitelist),
  blacklist: list(flags.blacklist),
  only: list(flags.only),
  ignore: list(flags.ignore)
}

if (cli.input.length === 0) {
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (data) => {
    detect(String(data).trim())
  })
} else {
  detect(value)
}

/**
 * @param {string} value
 */
function detect(value) {
  if (flags.all) {
    const results = francAll(value, options)
    let index = -1
    while (++index < results.length) {
      console.log(results[index][0] + ' ' + results[index][1])
    }
  } else {
    console.log(franc(value, options))
  }
}

function help() {
  return [
    'Usage: ' + command + ' [options] <string>',
    '',
    'Options:',
    '',
    '  -h, --help                    output usage information',
    '  -v, --version                 output version number',
    '  -m, --min-length <number>     minimum length to accept',
    '  -o, --only <string>           allow languages',
    '  -i, --ignore <string>         disallow languages',
    '  -a, --all                     display all guesses',
    '',
    'Usage:',
    '',
    '# output language',
    '$ ' + command + ' "Alle menslike wesens word vry"',
    '# ' + franc('Alle menslike wesens word vry'),
    '',
    '# output language from stdin (expects utf8)',
    '$ echo "এটি একটি ভাষা একক IBM স্ক্রিপ্ট" | ' + command,
    '# ' + franc('এটি একটি ভাষা একক IBM স্ক্রিপ্ট'),
    '',
    '# ignore certain languages',
    '$ ' + command + ' --ignore por,glg "O Brasil caiu 26 posições"',
    '# ' + franc('O Brasil caiu 26 posições', {ignore: ['por', 'glg']}),
    '',
    '# output language from stdin with only',
    '$ echo "Alle mennesker er født frie og" | ' + command + ' --only nob,dan',
    '# ' + franc('Alle mennesker er født frie og', {only: ['nob', 'dan']})
  ].join('\n')
}

/**
 * @param {string|undefined} value
 * @returns {Array<string>}
 */
function list(value) {
  return value ? String(value).split(',') : []
}
