'use strict';

/* eslint-disable no-cond-assign */

var fixtures,
    franc,
    guesslanguage,
    languagedetect,
    exception,
    Vac;

franc = require('./');
fixtures = require('./test/fixtures.json');

try {
    guesslanguage = require('guesslanguage').guessLanguage;
} catch (err) {
    exception = err;
}

try {
    languagedetect = new (require('languagedetect'))();
} catch (err) {
    exception = err;
}

try {
    Vac = require('vac');
} catch (err) {
    exception = err;
}

if (exception) {
    console.log(
        '\u001B[0;31m' +
        'The libraries needed by this benchmark could not be found. ' +
        'Please execute:\n' +
        '\tnpm run install-benchmark\n\n' +
        '\u001B[0m'
    );
}

function guessLanguage(fixture) {
    var result;

    guesslanguage.detect(fixture, function (language) {
        result = language;
    });

    return result;
}

function languageDetect(fixture) {
    var result;

    result = languagedetect.detect(fixture, 1)[0];

    return result && result[0];
}

function vac(fixture) {
    return Object.keys(Vac.detect(fixture, 1))[0];
}

function forEveryLanguage(callback) {
    Object.keys(fixtures).forEach(function (language) {
        callback(fixtures[language]);
    });
}

suite(
    'benchmarks * ' +
    Object.keys(fixtures).length +
    ' paragraphs in different languages',
    function () {
        set('iterations', 10);
        set('type', 'static');

        bench('franc -- this module', function () {
            forEveryLanguage(franc);
        });

        if (guesslanguage) {
            bench('guesslanguage', function () {
                forEveryLanguage(guessLanguage);
            });
        }

        if (languagedetect) {
            bench('languagedetect', function () {
                forEveryLanguage(languageDetect);
            });
        }

        if (Vac) {
            bench('vac', function () {
                forEveryLanguage(vac);
            });
        }
    }
);
