/* eslint-env browser */
import debounce from 'debounce'
import {francAll} from 'franc'
import {toName} from './to-name.js'
import {fixtures} from './fixtures.js'

const $input = document.querySelectorAll('textarea')[0]
const $output = document.querySelectorAll('tbody')[0]

const onchange = debounce(oninputchange, 100)

$input.addEventListener('input', onchange)

const keys = Object.keys(fixtures)
const key = keys[Math.floor(Math.random() * keys.length)]

$input.value = fixtures[key].fixture

oninputchange()

function oninputchange() {
  while ($output.firstChild) {
    $output.firstChild.remove()
  }

  const result = francAll($input.value)
  let index = -1
  while (++index < result.length) {
    const [code, score] = result[index]
    const $node = document.createElement('tr')
    const link = document.createElement('a')

    link.href = 'https://iso639-3.sil.org/code/' + code
    link.textContent = code

    const c0 = document.createElement('td')
    const c1 = document.createElement('td')
    const c2 = document.createElement('td')
    c0.append(link)
    c1.textContent = toName[code]
    c2.textContent = score

    $node.append(c0)
    $node.append(c1)
    $node.append(c2)

    $output.append($node)
  }

  $input.style.height = $input.scrollHeight + 'px'
}
