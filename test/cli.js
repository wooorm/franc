/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

import process from 'node:process'
import path from 'node:path'
import fs from 'node:fs'
import {exec} from 'node:child_process'
import {PassThrough} from 'node:stream'
import test from 'tape'

const root = path.resolve(process.cwd(), 'packages', 'franc-cli')

/** @type {PackageJson} */
const pkg = JSON.parse(
  String(
    fs.readFileSync(
      path.resolve(process.cwd(), 'packages', 'franc-cli', 'package.json')
    )
  )
)
const cli = path.resolve(root, 'index.js')

test('cli', (t) => {
  const af = 'Alle menslike wesens word vry'
  const no = 'Alle mennesker er født frie og'
  const ptBr = 'O Brasil caiu 26 posições'
  const help = ['-h', '--help']
  const version = ['-v', '--version']
  const disallow = ['-i', '--ignore', '-b', '--blacklist']
  const allow = ['-o', '--only', '-w', '--whitelist']
  const minLength = ['-m', '--min-length']
  const all = ['-a', '--all']

  t.plan(21)

  for (const flag of version) {
    exec(cli + ' ' + flag, (error, stdout, stderr) => {
      t.deepEqual([error, stderr, stdout], [null, '', pkg.version + '\n'], flag)
    })
  }

  for (const flag of help) {
    exec(cli + ' ' + flag, (error, stdout, stderr) => {
      t.deepEqual(
        [error, stderr, /^\s+CLI to detect the language of text/.test(stdout)],
        [null, '', true],
        flag
      )
    })
  }

  exec(cli + ' "' + af + '"', (error, stdout, stderr) => {
    t.deepEqual([error, stderr, stdout], [null, '', 'afr\n'], 'argument')
  })

  exec(cli + ' ' + af, (error, stdout, stderr) => {
    t.deepEqual(
      [error, stderr, stdout],
      [null, '', 'afr\n'],
      'multiple arguments'
    )
  })

  const subprocess = exec(cli, (error, stdout, stderr) => {
    t.deepEqual([error, stderr, stdout], [null, '', 'afr\n'], 'stdin')
  })

  const input = new PassThrough()

  if (subprocess.stdin) {
    input.pipe(subprocess.stdin)
  }

  input.write(af.slice(0, af.length / 2))

  setImmediate(() => {
    input.end(af.slice(af.length / 2))
  })

  for (const flag of allow) {
    const args = [cli, flag, 'nob,dan', '"' + no + '"'].join(' ')
    exec(args, (error, stdout, stderr) => {
      t.deepEqual([error, stderr, stdout], [null, '', 'nob\n'], flag)
    })
  }

  for (const flag of disallow) {
    const args = [cli, flag, 'por,glg', '"' + ptBr + '"'].join(' ')
    exec(args, (error, stdout, stderr) => {
      t.deepEqual([error, stderr, stdout], [null, '', 'vec\n'], flag)
    })
  }

  for (const flag of minLength) {
    exec([cli, flag, '3', 'the'].join(' '), (error, stdout, stderr) => {
      t.deepEqual(
        [error, stderr, stdout],
        [null, '', 'sco\n'],
        flag + ' (satisfied)'
      )
    })

    exec([cli, flag, '4', 'the'].join(' '), (error, stdout, stderr) => {
      t.deepEqual(
        [error, stderr, stdout],
        [null, '', 'und\n'],
        flag + ' (unsatisfied)'
      )
    })
  }

  for (const flag of all) {
    const args = [cli, flag, af].join(' ')
    exec(args, (error, stdout, stderr) => {
      t.deepEqual(
        [error, stderr, stdout.split('\n').slice(0, 3)],
        [
          null,
          '',
          ['afr 1', 'nld 0.7419425564569173', 'nob 0.5446174084630564']
        ],
        flag
      )
    })
  }
})
