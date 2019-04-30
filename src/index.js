'use strict'

/* eslint-env browser */

var franc = require('franc')
var debounce = require('debounce')
var fixtures = require('./fixtures.json')
var names = require('./list.json')

var $input = document.querySelectorAll('textarea')[0]
var $output = document.querySelectorAll('tbody')[0]

var onchange = debounce(oninputchange, 100)

$input.addEventListener('input', onchange)

$input.value = fixtures[Math.floor(Math.random() * fixtures.length)]

oninputchange()

function oninputchange() {
  while ($output.firstChild) {
    $output.removeChild($output.firstChild)
  }

  franc.all($input.value).forEach(add)

  $input.style.height = $input.scrollHeight + 'px'

  function add(result) {
    var $node = document.createElement('tr')
    var link = document.createElement('a')
    var name = names[result[0]]

    link.href = 'https://iso639-3.sil.org/code/' + result[0]
    link.textContent = result[0]

    $node.appendChild(document.createElement('td')).appendChild(link)
    $node.appendChild(document.createElement('td')).textContent = name
    $node.appendChild(document.createElement('td')).textContent = result[1]

    $output.appendChild($node)
  }
}
