'use strict'

var path = require('path')
var PassThrough = require('stream').PassThrough
var test = require('tape')
var execa = require('execa')

var root = path.resolve(process.cwd(), 'packages', 'franc-cli')
var pkg = require(path.resolve(root, 'package.json'))
var cli = path.resolve(root, 'index.js')

test('cli', function(t) {
  var help = ['-h', '--help']
  var version = ['-v', '--version']
  var disallow = ['-i', '--ignore', '-b', '--blacklist']
  var allow = ['-o', '--only', '-w', '--whitelist']
  var minLength = ['-m', '--min-length']
  var all = ['-a', '--all']

  t.plan(21)

  version.forEach(function(flag) {
    execa(cli, [flag]).then(function(result) {
      t.equal(result.stdout, pkg.version, flag)
    }, t.ifErr)
  })

  help.forEach(function(flag) {
    execa(cli, [flag]).then(function(result) {
      t.ok(/^\s+CLI to detect the language of text/.test(result.stdout), flag)
    }, t.ifErr)
  })

  execa(cli, ['Alle menslike wesens word vry']).then(function(result) {
    t.equal(result.stdout, 'afr', 'argument')
  }, t.ifErr)

  execa(cli, ['Alle', 'menslike', 'wesens', 'word', 'vry']).then(function(
    result
  ) {
    t.equal(result.stdout, 'afr', 'multiple arguments')
  },
  t.ifErr)

  t.test('stdin', function(st) {
    var stream = new PassThrough()
    var values = ['Alle', 'menslike', 'wesens', 'word', 'vry']
    var index = -1
    var length = values.length

    st.plan(1)

    function send() {
      index++

      if (index === length) {
        stream.end(values[index])
      } else {
        stream.write(values[index] + ' ')
        setTimeout(send, 10)
      }
    }

    send()

    execa(cli, {input: stream}).then(function(result) {
      st.equal(result.stdout, 'afr', 'stdin')
    }, st.ifErr)
  })

  allow.forEach(function(flag) {
    execa(cli, [flag, 'nob,dan', 'Alle mennesker er født frie og']).then(
      function(result) {
        t.equal(result.stdout, 'nob', flag)
      },
      t.ifErr
    )
  })

  disallow.forEach(function(flag) {
    execa(cli, [flag, 'por,glg', 'O Brasil caiu 26 posições']).then(function(
      result
    ) {
      t.equal(result.stdout, 'vec', flag)
    },
    t.ifErr)
  })

  minLength.forEach(function(flag) {
    execa(cli, [flag, '3', 'the']).then(function(result) {
      t.equal(result.stdout, 'sco', flag + ' (satisfied)')
    }, t.ifErr)

    execa(cli, [flag, '4', 'the']).then(function(result) {
      t.equal(result.stdout, 'und', flag + ' (unsatisfied)')
    }, t.ifErr)
  })

  all.forEach(function(flag) {
    execa(cli, [flag, 'Alle menslike wesens word vry']).then(function(result) {
      t.deepEqual(
        result.stdout.split('\n').slice(0, 3),
        ['afr 1', 'nld 0.7569230769230769', 'nob 0.544'],
        flag
      )
    }, t.ifErr)
  })
})
