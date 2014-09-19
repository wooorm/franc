/* Guess the natural language of a text
 * Copyright (c) 2014 Titus Wormer <tituswormer@gmail.com>
 * http://github.com/wooorm/franc/
 *
 * Original Python package:
 * Copyright (c) 2008, Kent S Johnson
 * http://code.google.com/p/guess-language/
 *
 * Original C++ version for KDE:
 * Copyright (c) 2006 Jacob R Rideout <kde@jacobrideout.net>
 * http://websvn.kde.org/branches/work/sonnet-refactoring/common/
 *     nlp/guesslanguage.cpp?view=markup
 *
 * Original Language::Guess Perl module:
 * Copyright (c) 2004-2006 Maciej Ceglowski
 * http://web.archive.org/web/20090228163219/http://languid.cantbedone.org/
 *
 * Note: Language::Guess is GPL-licensed. KDE developers received permission
 * from the author to distribute their port under LGPL:
 * http://lists.kde.org/?l=kde-sonnet&m=116910092228811&w=2
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
'use strict';

var models,
    utilities,
    MAX_LENGTH, MIN_LENGTH, MAX_DIFFERENCE, SINGLETONS, UNDETERMINED,
    ALL_LATIN, CYRILLIC, ARABIC, DEVANAGARI, PT,
    unicodeBlocks, singletonsLength, unicodeBlockCount;

utilities = require('trigram-utils');

models = require('./data.json');

(function () {
    var languageModel, languageName, iterator, length, newModel;

    for (languageName in models) {
        languageModel = models[languageName].split('|');

        iterator = -1;
        length = languageModel.length;
        models[languageName] = newModel = {};

        while (++iterator < length) {
            newModel[languageModel[iterator]] = iterator;
        }
    }
})();

MAX_LENGTH = 4096;
MIN_LENGTH = 10;
MAX_DIFFERENCE = 300;

SINGLETONS = [
  ['armenian', 'hy'],
  ['bengali', 'bn'],
  ['burmese', 'my'],
  ['georgian', 'ka'],
  ['greek', 'el'],
  ['gujarati', 'gu'],
  ['gurmukhi', 'pa'],
  ['hebrew', 'he'],
  ['kannada', 'kn'],
  ['khmer', 'km'],
  ['lao', 'lo'],
  ['malayalam', 'ml'],
  ['mongolian', 'mn'],
  ['oriya', 'or'],
  ['sinhala', 'si'],
  ['tamil', 'ta'],
  ['telugu', 'te'],
  ['thai', 'th'],
  ['tibetan', 'bo']
];

singletonsLength = SINGLETONS.length;

UNDETERMINED = [['und', 1]];

ALL_LATIN = [
    /* Basic Latin */
    'ceb', 'en', 'eu', 'ha', 'haw', 'id', 'la', 'nr', 'nso', 'so', 'ss',
    'st', 'sw', 'tlh', 'tn', 'ts', 'xh', 'zu',

    /* Extended Latin */
    'af', 'az', 'ca', 'cs', 'cy', 'da', 'de', 'es', 'et', 'fi', 'fr', 'hr',
    'hu', 'is', 'it', 'lt', 'lv', 'nl', 'no', 'pl', 'pt', 'ro', 'sk', 'sl',
    'sq', 'sv', 'tl', 'tr', 've', 'vi'
];

CYRILLIC = ['bg', 'kk', 'ky', 'mk', 'mn', 'ru', 'sr', 'uk', 'uz'];

ARABIC = ['ar', 'fa', 'ps', 'ur'];

DEVANAGARI = ['hi', 'ne'];

PT = ['pt-BR', 'pt-PT'];

/* Unicode block expressions. */
unicodeBlocks = [
    ['arabic', /[\u0600-\u06FF]/g],
    ['arabicPresentationFormsA', /[\uFB50-\uFDFF]/g],
    ['arabicPresentationFormsB', /[\uFE70-\uFEFF]/g],
    ['armenian', /[\u0530-\u058F]/g],
    ['bengali', /[\u0980-\u09FF]/g],
    ['bopomofo', /[\u3100-\u312F]/g],
    ['bopomofoExtended', /[\u31A0-\u31BF]/g],
    ['burmese', /[\u1000-\u109F]/g],
    ['CJKUnifiedIdeographs', /[\u4E00-\u9FFF]/g],
    ['cyrillic', /[\u0400-\u04FF]/g],
    ['devanagari', /[\u0900-\u097F]/g],
    ['georgian', /[\u10A0-\u10FF]/g],
    ['greekAndCoptic', /[\u0370-\u03FF]/g],
    ['gujarati', /[\u0A80-\u0AFF]/g],
    ['gurmukhi', /[\u0A00-\u0A7F]/g],
    ['hangulCompatibilityJamo', /[\u3130-\u318F]/g],
    ['hangulJamo', /[\u1100-\u11FF]/g],
    ['hangulSyllables', /[\uAC00-\uD7AF]/g],
    ['hebrew', /[\u0590-\u05FF]/g],
    ['hiragana', /[\u3040-\u309F]/g],
    ['xangXiRadicals', /[\u2F00-\u2FDF]/g],
    ['kannada', /[\u0C80-\u0CFF]/g],
    ['katakana', /[\u30A0-\u30FF]/g],
    ['katakanaPhoneticExtensions', /[\u31F0-\u31FF]/g],
    ['khmer', /[\u1780-\u17FF]/g],
    ['lao', /[\u0E80-\u0EFF]/g],
    ['malayalam', /[\u0D00-\u0D7F]/g],
    ['mongolian', /[\u1800-\u18AF]/g],
    ['oriya', /[\u0B00-\u0B7F]/g],
    ['sinhala', /[\u0D80-\u0DFF]/g],
    ['tamil', /[\u0B80-\u0BFF]/g],
    ['telugu', /[\u0C00-\u0C7F]/g],
    ['thai', /[\u0E00-\u0E7F]/g],
    ['tibetan', /[\u0F00-\u0FFF]/g]
];

unicodeBlockCount = unicodeBlocks.length;

/**
 * Deep regular sort on the number at `1` in both objects. E.g. [1, 5, 20];
 *
 * @param {Array} a
 * @param {Array} b
 * @api private
 */
function sort(a, b) {
    return a[1] - b[1];
}

/**
 * Get the ditsance between an array of trigram--count tuples, and a
 * language-model
 *
 * @param {Array<string, number>[]} trigrams - An array containing
 *     trigram--count tupples.
 * @param {Object} model - A language model.
 * @return {number} - The difference between the two.
 * @api private
 */
function getDistance(trigrams, model) {
    var distance = 0,
        iterator = -1,
        length = trigrams.length,
        trigram, difference;

    while (++iterator < length) {
        trigram = trigrams[iterator];

        if (trigram[0] in model) {
            difference = trigram[1] - model[trigram[0]];

            if (difference < 0) {
                difference = -difference;
            }

            distance += difference;
        } else {
            distance += MAX_DIFFERENCE;
        }
    }

    return distance;
}

/**
 * Get the difference between an array of trigram--count tuples, and multiple
 * languages.
 *
 * @param {Array<string, number>[]} trigrams - An array containing
 *     trigram--count tupples.
 * @param {string[]} languages - A list of languages.
 * @return {Array<string, number>[]} - An array containing language--distance
 *     tupples.
 * @api private
 */
function getDistances(trigrams, languages) {
    var distances, iterator, length, language, model;

    distances = [];
    iterator = -1;
    length = languages.length;

    while (++iterator < length) {
        language = languages[iterator];
        model = models[language];

        distances[iterator] = [language, getDistance(trigrams, model)];
    }

    return distances.sort(sort);
}

/**
 * Get an object listing how many characters in a certain script occur in
 * the given value.
 *
 * @param {string} value - The value to parse.
 * @return {Object.<string, number>} - An object containing each script in
 *     `unicodeBlocks`, and how many times characters in that script occur
 *     in the given value.
 * @api private
 */
function getScripts(value) {
    var iterator = -1,
        scripts = {},
        length = value.length,
        script, count;

    while (++iterator < unicodeBlockCount) {
        script = unicodeBlocks[iterator];
        count = value.match(script[1]);

        scripts[script[0]] = (count ? count.length : 0) / length;
    }

    return scripts;
}

/**
 * Get a list of probably languages the given source is in.
 *
 * @param {string} value - The value to parse.
 * @return {Array.<string, number>[]} - An array containing
 *     language--probability tuples.
 * @api public
 */
function detectAll(value) {
    var scripts, distances, iterator, singleton, trigrams;

    if (!value) {
        return UNDETERMINED.concat();
    }

    value = value.substr(0, MAX_LENGTH);

    scripts = getScripts(value);

    if (
        scripts.hangulSyllables +
        scripts.hangulJamo +
        scripts.hangulCompatibilityJamo >= 0.4
    ) {
        return [['ko', 1]];
    }

    if (scripts.greekAndCoptic >= 0.4) {
        return [['el', 1]];
    }

    if (
        scripts.hiragana +
        scripts.katakana +
        scripts.katakanaPhoneticExtensions >= 0.2
    ) {
        return [['ja', 1]];
    }

    if (
        scripts.CJKUnifiedIdeographs +
        scripts.bopomofo +
        scripts.bopomofoExtended +
        scripts.xangXiRadicals >= 0.4
    ) {
        return [['zh', 1]];
    }

    if (value.length < MIN_LENGTH) {
        return UNDETERMINED.concat();
    }

    iterator = -1;

    while (++iterator < singletonsLength) {
        singleton = SINGLETONS[iterator];

        if (scripts[singleton[0]] >= 0.4) {
            return [[singleton[1], 1]];
        }
    }

    trigrams = utilities.asTuples(value);

    if (scripts.cyrillic >= 0.4) {
        return getDistances(trigrams, CYRILLIC);
    }

    if (
        scripts.arabic +
        scripts.arabicPresentationFormsA +
        scripts.arabicPresentationFormsB >= 0.4
    ) {
        return getDistances(trigrams, ARABIC);
    }

    if (scripts.devanagari >= 0.4) {
        return getDistances(trigrams, DEVANAGARI);
    }

    distances = getDistances(trigrams, ALL_LATIN);

    if (distances[0][0] === 'pt') {
        distances = getDistances(trigrams, PT).concat(distances);
    }

    return distances;
}

/**
 * Get the most probable languages the given source is in.
 *
 * @param {string} value - The value to parse.
 * @return {string} - The most probable language.
 * @api public
 */
function detect(value) {
    return detectAll(value)[0][0];
}

detect.all = detectAll;

module.exports = detect;
