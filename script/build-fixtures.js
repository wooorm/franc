'use strict';

/**
 * Dependencies.
 */

var supported,
    supportedScripts,
    customFixtures,
    udhr;

supported = require('../data/supported-languages');
customFixtures = require('../data/custom-fixtures');
supportedScripts = require('../data/supported-script-languages');
udhr = require('udhr').json();

/**
 * Merge script- and trigram-detection: both need
 * fixtures.
 */

Object.keys(supportedScripts).forEach(function (key) {
    supported[key] = supportedScripts[key];
});

/**
 * Get fixtures from UDHR preamble's.
 */

var data;

data = {};

Object.keys(supported).forEach(function (key) {
    var udhrKey,
        preamble;

    udhrKey = supported[key];

    try {
        preamble = udhr[udhrKey].preamble.para;
    } catch (exception) {
        console.log(
            'Could not access preamble for `' + key + '` ' +
            '(' + udhrKey + ')'
        );

        if (udhrKey in customFixtures) {
            preamble = customFixtures[udhrKey];

            console.log(
                '  - Could access preamble for `' + key + '` ' +
                '(' + udhrKey + ') from custom fixtures.'
            );
        } else {
            throw exception;
        }
    }

    /**
     * Some preamble
     */

    preamble = preamble.slice(0, 200);

    data[key] = preamble;
});

/**
 * Add a fixture for `und`: Undetermined languages.
 */

data.und = '';

data = JSON.stringify(data, 0, 2);

/**
 * Write.
 */

require('fs').writeFileSync('spec/fixtures.json', data);
