'use strict';

/*
 * Dependencies.
 */

var fixtures,
    franc;

franc = require('./');
fixtures = require('./test/fixtures.json');

/*
 * Optional dependencies.
 */

var hasException,
    guesslanguage,
    languagedetect,
    Vac;

try {
    guesslanguage = require('guesslanguage').guessLanguage;
} catch (err) {
    hasException = true;
}

try {
    languagedetect = new (require('languagedetect'))();
} catch (err) {
    hasException = true;
}

try {
    Vac = require('vac');
} catch (err) {
    hasException = true;
}

if (hasException) {
    console.log(
        '\u001B[0;31m' +
        'The libraries needed by this benchmark could not be found. ' +
        'Please execute:\n' +
        '\tnpm run install-benchmark\n\n' +
        '\u001B[0m'
    );
}

/**
 * Wrap `guesslanguage`.
 *
 * @param {string} fixture
 * @return {string} - Most probable language.
 */
function guessLanguage(fixture) {
    var result;

    guesslanguage.detect(fixture, function (language) {
        result = language;
    });

    return result;
}

/**
 * Wrap `languagedetect`.
 *
 * @param {string} fixture
 * @return {string} - Most probable language.
 */
function languageDetect(fixture) {
    var result;

    result = languagedetect.detect(fixture, 1)[0];

    return result && result[0];
}

/**
 * Wrap `vac`.
 *
 * @param {string} fixture
 * @return {string} - Most probable language.
 */
function vac(fixture) {
    return Object.keys(Vac.detect(fixture, 1))[0];
}

/**
 * Invoke `callback` for every fixture in `fixtures`.
 *
 * @param {function(string)} callback
 */
function eachFixture(callback) {
    Object.keys(fixtures).forEach(function (language) {
        callback(fixtures[language]);
    });
}

/*
 * Get fixture count.
 */

var fixtureCount;

fixtureCount = Object.keys(fixtures).length;

suite(
    'benchmarks * ' + fixtureCount + ' paragraphs in different languages',
    function () {
        set('iterations', 10);
        set('type', 'static');

        bench('franc -- this module', function () {
            eachFixture(franc);
        });

        if (guesslanguage) {
            bench('guesslanguage', function () {
                eachFixture(guessLanguage);
            });
        }

        if (languagedetect) {
            bench('languagedetect', function () {
                eachFixture(languageDetect);
            });
        }

        if (Vac) {
            bench('vac', function () {
                eachFixture(vac);
            });
        }
    }
);
