/* eslint-env browser */
import debounce from 'debounce'
import {francAll} from 'franc'
import {toName} from './to-name.js'
import {fixtures} from './fixtures.js'

var $input = document.querySelectorAll('textarea')[0]
var $output = document.querySelectorAll('tbody')[0]

var onchange = debounce(oninputchange, 100)

$input.addEventListener('input', onchange)

const keys = Object.keys(fixtures)
const key = keys[Math.floor(Math.random() * keys.length)]

$input.value = fixtures[key].fixture

oninputchange()

function oninputchange() {
  while ($output.firstChild) {
    $output.removeChild($output.firstChild)
  }

  francAll($input.value).forEach(add)

  $input.style.height = $input.scrollHeight + 'px'

  function add(result) {
    var $node = document.createElement('tr')
    var link = document.createElement('a')

    link.href = 'https://iso639-3.sil.org/code/' + result[0]
    link.textContent = result[0]

    $node.appendChild(document.createElement('td')).appendChild(link)
    $node.appendChild(document.createElement('td')).textContent =
      toName[result[0]]
    $node.appendChild(document.createElement('td')).textContent = result[1]

    $output.appendChild($node)
  }
}
