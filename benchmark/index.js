'use strict';

/* eslint-disable no-cond-assign */

var fixtures, franc, guesslanguage, languagedetect, Vac;

franc = require('..');
fixtures = require('../spec/fixtures.json');

try {
    guesslanguage = require('guesslanguage').guessLanguage;
    languagedetect = new (require('languagedetect'))();
    Vac = require('vac');
} catch (error) {
    console.log(error);
    throw new Error(
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
    var result = languagedetect.detect(fixture, 1)[0];
    return result && result[0];
}

function vac(fixture) {
    return Object.keys(Vac.detect(fixture, 1))[0];
}

function forEveryLanguage(callback) {
    var language;

    for (language in fixtures) {
        callback(language, fixtures[language]);
    }
}

suite(
    'benchmarks * ' +
    Object.keys(fixtures).length +
    ' paragraphs in different languages',
    function () {
        set('iterations', 10);
        set('type', 'static');

        bench('franc -- this module', function () {
            forEveryLanguage(function (language, fixture) {
                franc(fixture);
            });
        });

        bench('guesslanguage', function () {
            forEveryLanguage(function (language, fixture) {
                guessLanguage(fixture);
            });
        });

        bench('languagedetect', function () {
            forEveryLanguage(function (language, fixture) {
                languageDetect(fixture);
            });
        });

        bench('vac', function () {
            forEveryLanguage(function (language, fixture) {
                vac(fixture);
            });
        });
    }
);
