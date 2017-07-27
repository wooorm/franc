'use strict';

/* eslint-env browser */

var franc = require('franc');
var debounce = require('debounce');
var fixtures = require('./fixtures');
var names = require('./list');

var $input = document.getElementsByTagName('textarea')[0];
var $output = document.getElementsByTagName('tbody')[0];

var onchange = debounce(oninputchange, 100);

$input.addEventListener('input', onchange);

$input.value = fixtures[Math.floor(Math.random() * fixtures.length)];

oninputchange();

function oninputchange() {
  while ($output.firstChild) {
    $output.removeChild($output.firstChild);
  }

  franc.all($input.value).forEach(add);

  $input.style.height = $input.scrollHeight + 'px';

  function add(result) {
    var $node = document.createElement('tr');
    var link = document.createElement('a');

    link.href = 'http://www-01.sil.org/iso639-3/documentation.asp?id=' + result[0];
    link.textContent = result[0];

    $node.appendChild(document.createElement('td')).appendChild(link);
    $node.appendChild(document.createElement('td')).textContent = names[result[0]];
    $node.appendChild(document.createElement('td')).textContent = result[1];

    $output.appendChild($node);
  }
}
