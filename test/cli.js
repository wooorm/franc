'use strict'

var path = require('path')
var exec = require('child_process').exec
var PassThrough = require('stream').PassThrough
var test = require('tape')

var root = path.resolve(process.cwd(), 'packages', 'franc-cli')
var pkg = require(path.resolve(root, 'package.json'))
var cli = path.resolve(root, 'index.js')

test('cli', function (t) {
  var af = 'Alle menslike wesens word vry'
  var no = 'Alle mennesker er født frie og'
  var ptBr = 'O Brasil caiu 26 posições'
  var help = ['-h', '--help']
  var version = ['-v', '--version']
  var disallow = ['-i', '--ignore', '-b', '--blacklist']
  var allow = ['-o', '--only', '-w', '--whitelist']
  var minLength = ['-m', '--min-length']
  var all = ['-a', '--all']

  t.plan(21)

  version.forEach(function (flag) {
    exec(cli + ' ' + flag, function (err, stdout, stderr) {
      t.deepEqual([err, stderr, stdout], [null, '', pkg.version + '\n'], flag)
    })
  })

  help.forEach(function (flag) {
    exec(cli + ' ' + flag, function (err, stdout, stderr) {
      t.deepEqual(
        [err, stderr, /^\s+CLI to detect the language of text/.test(stdout)],
        [null, '', true],
        flag
      )
    })
  })

  exec(cli + ' "' + af + '"', function (err, stdout, stderr) {
    t.deepEqual([err, stderr, stdout], [null, '', 'afr\n'], 'argument')
  })

  exec(cli + ' ' + af, function (err, stdout, stderr) {
    t.deepEqual(
      [err, stderr, stdout],
      [null, '', 'afr\n'],
      'multiple arguments'
    )
  })

  var subprocess = exec(cli, function (err, stdout, stderr) {
    t.deepEqual([err, stderr, stdout], [null, '', 'afr\n'], 'stdin')
  })

  var input = new PassThrough()

  input.pipe(subprocess.stdin)
  input.write(af.slice(0, af.length / 2))

  setImmediate(function () {
    input.end(af.slice(af.length / 2))
  })

  allow.forEach(function (flag) {
    var args = [cli, flag, 'nob,dan', '"' + no + '"'].join(' ')
    exec(args, function (err, stdout, stderr) {
      t.deepEqual([err, stderr, stdout], [null, '', 'nob\n'], flag)
    })
  })

  disallow.forEach(function (flag) {
    var args = [cli, flag, 'por,glg', '"' + ptBr + '"'].join(' ')
    exec(args, function (err, stdout, stderr) {
      t.deepEqual([err, stderr, stdout], [null, '', 'vec\n'], flag)
    })
  })

  minLength.forEach(function (flag) {
    exec([cli, flag, '3', 'the'].join(' '), function (err, stdout, stderr) {
      t.deepEqual(
        [err, stderr, stdout],
        [null, '', 'sco\n'],
        flag + ' (satisfied)'
      )
    })

    exec([cli, flag, '4', 'the'].join(' '), function (err, stdout, stderr) {
      t.deepEqual(
        [err, stderr, stdout],
        [null, '', 'und\n'],
        flag + ' (unsatisfied)'
      )
    })
  })

  all.forEach(function (flag) {
    var args = [cli, flag, af].join(' ')
    exec(args, function (err, stdout, stderr) {
      t.deepEqual(
        [err, stderr, stdout.split('\n').slice(0, 3)],
        [null, '', ['afr 1', 'nld 0.7569230769230769', 'nob 0.544']],
        flag
      )
    })
  })
})
