'use strict';

/**
 * Dependencies.
 */

var trigrams,
    supported;

trigrams = require('trigrams').min();

supported = require('../data/supported-languages');

/**
 * Data.
 */

var data;

data = {};

Object.keys(supported).forEach(function (key6392) {
    data[key6392] = trigrams[supported[key6392]].reverse().join('|');
});

data = JSON.stringify(data, 0, 2);

/**
 * Write.
 */

require('fs').writeFileSync('lib/data.json', data);
