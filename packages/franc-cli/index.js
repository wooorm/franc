#!/usr/bin/env node
'use strict'

var meow = require('meow')
var franc = require('franc')
var pack = require('./package')

var command = Object.keys(pack.bin)[0]

var cli = meow(help(), {
  flags: {
    all: {
      type: 'boolean',
      alias: 'a'
    },
    whitelist: {
      type: 'string',
      alias: 'w'
    },
    blacklist: {
      type: 'string',
      alias: 'b'
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

var value = cli.input.join(' ').trim()
var flags = cli.flags

flags.minLength = Number(flags.minLength) || null

if (flags.whitelist) {
  flags.whitelist = String(flags.whitelist).split(',')
}

if (flags.blacklist) {
  flags.blacklist = String(flags.blacklist).split(',')
}

if (value) {
  detect(value)
} else {
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', function(data) {
    detect(data.trim())
  })
}

function detect(value) {
  var options = {
    minLength: flags.minLength,
    whitelist: flags.whitelist,
    blacklist: flags.blacklist
  }

  if (flags.all) {
    franc.all(value, options).forEach(function(language) {
      console.log(language[0] + ' ' + language[1])
    })
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
    '  -w, --whitelist <string>      allow languages',
    '  -b, --blacklist <string>      disallow languages',
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
    '# blacklist certain languages',
    '$ ' + command + ' --blacklist por,glg "O Brasil caiu 26 posições"',
    '# ' +
      franc('O Brasil caiu 26 posições', {
        blacklist: ['por', 'glg']
      }),
    '',
    '# output language from stdin with whitelist',
    '$ echo "Alle mennesker er født frie og" | ' +
      command +
      ' --whitelist nob,dan',
    '# ' +
      franc('Alle mennesker er født frie og', {
        whitelist: ['nob', 'dan']
      })
  ].join('\n')
}
