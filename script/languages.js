'use strict';

/**
 * Dependencies.
 */

var langs;

langs = require('langs');

/**
 * Data.
 */

var data;

data = {};

langs.all().forEach(function (language) {
    data[language[3]] = language.name;
})

data.ace = 'Aceh';
data.ada = 'Dangme';
data.aii = 'Assyrian';
data.arb = 'Arabic, Standard';
data.azj = 'Azerbaijani, North';
data.ceb = 'Cebuano';
data.pes = 'Persian, Iranian';
data.haw = 'Hawaiian';
data.khk = 'Mongolian, Halh';
data.nso = 'Sotho, Northern';
data.por = 'Portuguese (European)';
data.als = 'Albanian, Tosk';
data.swh = 'Swahili';
data.uzn = 'Uzbek, Northern';
data.cmn = 'Chinese, Mandarin';
data.und = 'Undetermined';

/**
 * Expose `data`.
 */

module.exports = data;
