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

var value = cli.input.join(' ').trim()
var flags = cli.flags

flags.minLength = Number(flags.minLength) || null

flags.whitelist = list(flags.whitelist)
flags.blacklist = list(flags.blacklist)
flags.only = flags.whitelist.concat(list(flags.only))
flags.ignore = flags.blacklist.concat(list(flags.ignore))

if (cli.input.length === 0) {
  process.stdin.resume()
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', function (data) {
    detect(data.trim())
  })
} else {
  detect(value)
}

function detect(value) {
  var options = {
    minLength: flags.minLength,
    only: flags.only,
    ignore: flags.ignore
  }

  if (flags.all) {
    franc.all(value, options).forEach(function (language) {
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

function list(value) {
  return value ? String(value).split(',') : []
}
