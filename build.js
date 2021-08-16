import https from 'https'
import fs from 'fs'
import path from 'path'
import {URL} from 'url'
import {bail} from 'bail'
import {iso6393} from 'iso-639-3'

var options = new URL(
  'https://raw.githubusercontent.com/wooorm/franc/main/test/fixtures.js'
)

const iso6393ToName = {}

let index = -1

while (++index < iso6393.length) {
  const info = iso6393[index]
  iso6393ToName[info.iso6393] = info.name
}

options.headers = {'User-Agent': 'request'}

https.request(options, onrequest).on('error', bail).end()

function onrequest(response) {
  response.pipe(fs.createWriteStream(path.join('src', 'fixtures.js')))
}

fs.writeFile(
  path.join('src', 'to-name.js'),
  'export const toName = ' + JSON.stringify(iso6393ToName, null, 2) + '\n',
  bail
)
