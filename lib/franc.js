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
    FOURTY_PERCENT,
    TWENTY_PERCENT,
    MAX_LENGTH,
    MIN_LENGTH,
    MAX_DIFFERENCE,
    SINGLETONS,
    ALL_LATIN,
    CYRILLIC,
    ARABIC,
    DEVANAGARI,
    unicodeBlocks,
    singletonsLength,
    unicodeBlockCount;

/**
 * Load `trigram-utils`.
 */

utilities = require('trigram-utils');

/**
 * Load trigram data files.
 */

models = require('./data.json');

/**
 * Construct trigram dictionaries.
 */

(function () {
    var languageModel,
        languageName,
        index,
        newModel;

    for (languageName in models) {
        languageModel = models[languageName].split('|');

        index = languageModel.length;
        models[languageName] = newModel = {};

        while (index--) {
            newModel[languageModel[index]] = index;
        }
    }
})();

/**
 * Maximum sample length.
 */

MAX_LENGTH = 4096;

/**
 * Minimum sample length.
 */

MIN_LENGTH = 10;

/**
 * The maximum distance to add when a given trigram does
 * not exist in a trigram dictionary.
 */

MAX_DIFFERENCE = 300;

/**
 * When the characters of certain scripts account for
 * 40% (or higher) of a string, the string is tested
 * against fewer than all trigrams.
 */

FOURTY_PERCENT = 0.4;

/**
 * When the characters of certain scripts account for
 * 20% (or higher) of a string, the string is tested
 * against fewer than all trigrams.
 */

TWENTY_PERCENT = 0.2;

/**
 * Some scripts are exclusivly used by a single language.
 * This list contains this mapping.
 */

SINGLETONS = [
  ['armenian', 'hye'],
  ['bengali', 'ben'],
  ['burmese', 'mya'],
  ['georgian', 'kat'],
  ['greek', 'ell'],
  ['gujarati', 'guj'],
  ['gurmukhi', 'pan'],
  ['hebrew', 'heb'],
  ['kannada', 'kan'],
  ['khmer', 'khm'],
  ['lao', 'lao'],
  ['malayalam', 'mal'],
  ['mongolian', 'khk'],
  ['oriya', 'ori'],
  ['sinhala', 'sin'],
  ['tamil', 'tam'],
  ['telugu', 'tel'],
  ['thai', 'tha'],
  ['tibetan', 'bod']
];

/**
 * Cached length of the above singletons.
 */

singletonsLength = SINGLETONS.length;

/**
 * A list of all languages which use the Latin
 * script (both basic and extended).
 */

ALL_LATIN = [
    /* Basic Latin */
    'ceb', 'eng', 'eus', 'hau', 'haw', 'ind', 'lat', 'nbl', 'nso', 'som',
    'ssw', 'sot', 'swh', 'tsn', 'tso', 'xho', 'zul',

    /* Extended Latin */
    'afr', 'azj', 'cat', 'ces', 'cym', 'dan', 'deu', 'spa', 'est', 'fin',
    'fra', 'hrv', 'hun', 'isl', 'ita', 'lit', 'lav', 'nld', 'nob', 'pol',
    'por', 'ron', 'slk', 'slv', 'als', 'swe', 'tgl', 'tur', 'ven', 'vie',
    'ace'
];

/**
 * A list of all languages which use the Cyrillic script.
 */

CYRILLIC = ['bul', 'kaz', 'kir', 'mkd', 'khk', 'rus', 'srp', 'ukr', 'uzn'];

/**
 * A list of all languages which use the Arabic script.
 */

ARABIC = ['arb', 'pes', 'urd'];

/**
 * A list of all languages which use the Devanagari script.
 */

DEVANAGARI = ['hin', 'nep'];

/**
 * Expressions to match certain scripts.
 */

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

/**
 * Cached length of the above script expression.
 */

unicodeBlockCount = unicodeBlocks.length;

/**
 * Deep regular sort on the number at `1` in both objects.
 *
 * @example
 *   > [[0, 20], [0, 1], [0, 5]].sort(sort);
 *   // [[0, 1], [0, 5], [0, 20]]
 *
 * @param {{1: number}} a
 * @param {{1: number}} b
 */

function sort(a, b) {
    return a[1] - b[1];
}

/**
 * Get the distance between an array of trigram--count tuples,
 * and a language dictionary.
 *
 * @param {Array.<Array.<string, number>>} trigrams - An
 *   array containing trigram--count tupples.
 * @param {Object.<string, number>} model - Object
 *   containing weighted trigrams.
 * @return {number} - The distance between the two.
 */

function getDistance(trigrams, model) {
    var distance,
        index,
        trigram,
        difference;

    distance = 0;
    index = trigrams.length;

    while (index--) {
        trigram = trigrams[index];

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
 * Get the distance between an array of trigram--count tuples,
 * and multiple languages.
 *
 * @param {Array.<Array.<string, number>>} trigrams - An
 *   array containing trigram--count tupples.
 * @param {Array.<string>} languages - multiple language
 *   codes to test against.
 * @return {Array.<Array.<string, number>>} An array
 *   containing language--distance tuples.
 */

function getDistances(trigrams, languages) {
    var distances,
        index,
        language,
        model;

    distances = [];
    index = languages.length;

    while (index--) {
        language = languages[index];
        model = models[language];

        distances[index] = [language, getDistance(trigrams, model)];
    }

    return distances.sort(sort);
}

/**
 * Get an object listing, from a given value, per script
 * the ammount of characters.
 *
 * @param {string} value - The value to test.
 * @return {Object.<string, number>} An object with scripts
 *   as keys and character occurrance couns as values.
 */

function getScripts(value) {
    var index,
        scripts,
        length,
        script,
        count;

    index = unicodeBlockCount;
    scripts = {};
    length = value.length;

    while (index--) {
        script = unicodeBlocks[index];
        count = value.match(script[1]);

        scripts[script[0]] = (count ? count.length : 0) / length;
    }

    return scripts;
}

/**
 * Create a single tuple as a list of tuples from a given
 * language code.
 *
 * @param {Array.<string, number>} An single
 *   language--distance tuple.
 * @return {Array.<Array.<string, number>>} An array
 *   containing a single language--distance.
 */

function singleLanguageTuples(language) {
    return [[language, 1]];
}

/**
 * Get a list of probable languages the given value is
 * written in.
 *
 * @param {string} value - The value to test.
 * @return {Array.<Array.<string, number>>} An array
 *   containing language--distance tuples.
 */

function detectAll(value) {
    var scripts,
        index,
        singleton,
        trigrams;

    if (!value) {
        return singleLanguageTuples('und');
    }

    value = value.substr(0, MAX_LENGTH);

    scripts = getScripts(value);

    if (
        scripts.hangulSyllables +
        scripts.hangulJamo +
        scripts.hangulCompatibilityJamo >= FOURTY_PERCENT
    ) {
        return singleLanguageTuples('kor');
    }

    if (scripts.greekAndCoptic >= FOURTY_PERCENT) {
        return singleLanguageTuples('ell');
    }

    if (
        scripts.hiragana +
        scripts.katakana +
        scripts.katakanaPhoneticExtensions >= TWENTY_PERCENT
    ) {
        return singleLanguageTuples('jpn');
    }

    if (
        scripts.CJKUnifiedIdeographs +
        scripts.bopomofo +
        scripts.bopomofoExtended +
        scripts.xangXiRadicals >= FOURTY_PERCENT
    ) {
        return singleLanguageTuples('cmn');
    }

    if (value.length < MIN_LENGTH) {
        return singleLanguageTuples('und');
    }

    index = singletonsLength;

    while (index--) {
        singleton = SINGLETONS[index];

        if (scripts[singleton[0]] >= FOURTY_PERCENT) {
            return singleLanguageTuples(singleton[1]);
        }
    }

    trigrams = utilities.asTuples(value);

    if (scripts.cyrillic >= FOURTY_PERCENT) {
        return getDistances(trigrams, CYRILLIC);
    }

    if (
        scripts.arabic +
        scripts.arabicPresentationFormsA +
        scripts.arabicPresentationFormsB >= FOURTY_PERCENT
    ) {
        return getDistances(trigrams, ARABIC);
    }

    if (scripts.devanagari >= FOURTY_PERCENT) {
        return getDistances(trigrams, DEVANAGARI);
    }

    return getDistances(trigrams, ALL_LATIN);
}

/**
 * Get the most probable language the given value is
 * written in.
 *
 * @param {string} value - The value to test.
 * @param {string} The most probable language.
 */

function detect(value) {
    return detectAll(value)[0][0];
}

/**
 * Expose `detectAll` on `franc`.
 */

detect.all = detectAll;

/**
 * Expose `franc`.
 */

module.exports = detect;
