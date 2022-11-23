/**
 * @typedef {import('type-fest').PackageJson} PackageJson
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import util from 'node:util'
import {fileURLToPath} from 'node:url'
import childProcess from 'node:child_process'
import {PassThrough} from 'node:stream'
import test from 'node:test'

const exec = util.promisify(childProcess.exec)

const root = new URL('../packages/franc-cli/', import.meta.url)

/** @type {PackageJson} */
const pkg = JSON.parse(String(await fs.readFile(new URL('package.json', root))))
const cli = fileURLToPath(new URL('index.js', root))

test('cli', async () => {
  const af = 'Alle menslike wesens word vry'
  const no = 'Alle mennesker er født frie og'
  const ptBr = 'O Brasil caiu 26 posições'

  // Version.
  assert.deepEqual(
    await exec(cli + ' -v'),
    {stderr: '', stdout: pkg.version + '\n'},
    '-v'
  )
  assert.deepEqual(
    await exec(cli + ' --version'),
    {stderr: '', stdout: pkg.version + '\n'},
    '--version'
  )

  // Help.
  const h = await exec(cli + ' -h')
  assert.match(h.stdout, /^\s+CLI to detect the language of text/, '-h')
  const help = await exec(cli + ' --help')
  assert.match(help.stdout, /^\s+CLI to detect the language of text/, '--help')

  // Main.
  assert.deepEqual(
    await exec(cli + ' "' + af + '"'),
    {stderr: '', stdout: 'afr\n'},
    'argument'
  )

  assert.deepEqual(
    await exec(cli + ' ' + af),
    {stderr: '', stdout: 'afr\n'},
    'multiple arguments'
  )

  await new Promise(function (resolve) {
    const input = new PassThrough()
    const subprocess = childProcess.exec(cli, function (error, stdout, stderr) {
      assert.deepEqual([error, stdout, stderr], [null, 'afr\n', ''], 'stdin')
      resolve(undefined)
    })
    assert(subprocess.stdin, 'expected stdin on `subprocess`')
    input.pipe(subprocess.stdin)
    input.write(af.slice(0, af.length / 2))
    setImmediate(function () {
      input.end(af.slice(af.length / 2))
    })
  })

  // Only.
  assert.deepEqual(
    await exec(cli + ' -o nob,dan "' + no + '"'),
    {stderr: '', stdout: 'nob\n'},
    '-o'
  )
  assert.deepEqual(
    await exec(cli + ' --only nob,dan "' + no + '"'),
    {stderr: '', stdout: 'nob\n'},
    '--only'
  )
  assert.deepEqual(
    await exec(cli + ' -w nob,dan "' + no + '"'),
    {stderr: '', stdout: 'nob\n'},
    '-w'
  )
  assert.deepEqual(
    await exec(cli + ' --whitelist nob,dan "' + no + '"'),
    {stderr: '', stdout: 'nob\n'},
    '--whitelist'
  )

  // Ignore.
  assert.deepEqual(
    await exec(cli + ' -i por,glg "' + ptBr + '"'),
    {stderr: '', stdout: 'vec\n'},
    '-i'
  )
  assert.deepEqual(
    await exec(cli + ' --ignore por,glg "' + ptBr + '"'),
    {stderr: '', stdout: 'vec\n'},
    '--ignore'
  )
  assert.deepEqual(
    await exec(cli + ' -b por,glg "' + ptBr + '"'),
    {stderr: '', stdout: 'vec\n'},
    '-b'
  )
  assert.deepEqual(
    await exec(cli + ' --blacklist por,glg "' + ptBr + '"'),
    {stderr: '', stdout: 'vec\n'},
    '--blacklist'
  )

  // Min.
  assert.deepEqual(
    await exec(cli + ' -m 3 "the"'),
    {stderr: '', stdout: 'sco\n'},
    '-m'
  )
  assert.deepEqual(
    await exec(cli + ' -m 4 "the"'),
    {stderr: '', stdout: 'und\n'},
    '-m (unsatisfied)'
  )
  assert.deepEqual(
    await exec(cli + ' --min-length 3 "the"'),
    {stderr: '', stdout: 'sco\n'},
    '--min-length'
  )
  assert.deepEqual(
    await exec(cli + ' --min-length 4 "the"'),
    {stderr: '', stdout: 'und\n'},
    '--min-length (unsatisfied)'
  )

  // All.
  const a = await exec(cli + ' -a "' + af + '"')
  assert.deepEqual(
    a.stdout.split('\n').slice(0, 3),
    ['afr 1', 'nld 0.7419425564569173', 'nob 0.5446174084630564'],
    '-a'
  )
  const all = await exec(cli + ' --all "' + af + '"')
  assert.deepEqual(
    all.stdout.split('\n').slice(0, 3),
    ['afr 1', 'nld 0.7419425564569173', 'nob 0.5446174084630564'],
    '--all'
  )
})
