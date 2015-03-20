'use strict';

/**
 * Dependencies.
 */

var franc = require('wooorm/franc@1.0.0');
var fixtures = require('./fixtures.js');
var debounce = require('component/debounce');

/**
 * DOM elements.
 */

var $input = document.getElementsByTagName('textarea')[0];
var $output = document.getElementsByTagName('ol')[0];

/**
 * Event handler.
 */

var oninputchange = debounce(function () {
    /**
     * Remove previous results.
     */

    while ($output.firstElementChild) {
        $output.removeChild($output.firstElementChild);
    }

    /**
     * Add new results.
     */

    franc.all($input.value).forEach(function (result, n) {
        var $node = document.createElement('li');

        $node.textContent = result[0] + ': ' + result[1];

        $output.appendChild($node);
    });
}, 50);

/**
 * Listen.
 */

$input.addEventListener('input', oninputchange);

/**
 * Add initial content.
 */

$input.value = fixtures[Math.floor(Math.random() * fixtures.length)];

/**
 * Provide initial answer.
 */

oninputchange();
