'use strict';

/* eslint-env commonjs */

/*
 * Load `trigram-utils`.
 */

var utilities = require('trigram-utils');

/*
 * Load `expressions` (regular expressions matching
 * scripts).
 */

var expressions = require('./expressions.js');

/*
 * Load `data` (trigram information per language,
 * per script).
 */

var data = require('./data.json');

/*
 * Construct trigram dictionaries.
 */

(function () {
    var languages;
    var name;
    var trigrams;
    var model;
    var script;
    var weight;

    for (script in data) {
        languages = data[script];

        for (name in languages) {
            model = languages[name].split('|');

            weight = model.length;

            trigrams = {};

            while (weight--) {
                trigrams[model[weight]] = weight;
            }

            languages[name] = trigrams;
        }
    }
})();

/*
 * Maximum sample length.
 */

var MAX_LENGTH = 2048;

/*
 * Minimum sample length.
 */

var MIN_LENGTH = 10;

/*
 * The maximum distance to add when a given trigram does
 * not exist in a trigram dictionary.
 */

var MAX_DIFFERENCE = 300;

/**
 * Deep regular sort on the number at `1` in both objects.
 *
 * @example
 *   > [[0, 20], [0, 1], [0, 5]].sort(sort);
 *   // [[0, 1], [0, 5], [0, 20]]
 *
 * @param {Object} a - Left-hand.
 * @param {Object} b - Right-hand.
 */
function sort(a, b) {
    return a[1] - b[1];
}

/**
 * Filter `languages` by removing languages in
 * `blacklist`, or including languages in `whitelist`.
 *
 * @param {Object.<Object>} languages - Languages
 *   to filter
 * @param {Array.<string>} whitelist - Whitelisted
 *   languages; if non-empty, only included languages
 *   are kept.
 * @param {Array.<string>} blacklist - Blacklisted
 *   languages; included languages are ignored.
 * @return {Object.<Object>} - Filtered array of
 *   languages.
 */
function filterLanguages(languages, whitelist, blacklist) {
    var filteredLanguages;
    var language;

    if (whitelist.length === 0 && blacklist.length === 0) {
        return languages;
    }

    filteredLanguages = {};

    for (language in languages) {
        if (
            (
                whitelist.length === 0 ||
                whitelist.indexOf(language) !== -1
            ) &&
            blacklist.indexOf(language) === -1
        ) {
            filteredLanguages[language] = languages[language];
        }
    }

    return filteredLanguages;
}

/**
 * Get the distance between an array of trigram--count
 * tuples, and a language dictionary.
 *
 * @param {Array.<Array.<string, number>>} trigrams - An
 *   array containing trigram--count tuples.
 * @param {Object.<number>} model - Object
 *   containing weighted trigrams.
 * @return {number} - The distance between the two.
 */
function getDistance(trigrams, model) {
    var distance = 0;
    var index = -1;
    var length = trigrams.length;
    var trigram;
    var difference;

    while (++index < length) {
        trigram = trigrams[index];

        if (trigram[0] in model) {
            difference = trigram[1] - model[trigram[0]] - 1;

            if (difference < 0) {
                difference = -difference;
            }
        } else {
            difference = MAX_DIFFERENCE;
        }

        distance += difference;
    }

    return distance;
}

/**
 * Create a single tuple as a list of tuples from a given
 * language code.
 *
 * @param {string} language - A single language.
 * @return {Array.<Array.<string, number>>} An array
 *   containing a single language--distance.
 */
function singleLanguageTuples(language) {
    return [[language, 1]];
}

/**
 * Create a single `und` tuple.
 *
 * @return {Array.<Array.<string, number>>} An array
 *   containing a single language--distance.
 */
function und() {
    return singleLanguageTuples('und');
}

/**
 * Get the distance between an array of trigram--count
 * tuples, and multiple trigram dictionaries.
 *
 * @param {Array.<Array.<string, number>>} trigrams - An
 *   array containing trigram--count tuples.
 * @param {Object.<Object>} languages - multiple
 *   trigrams to test against.
 * @param {Object} options - Configuration.
 * @return {Array.<Array.<string, number>>} An array
 *   containing language--distance tuples.
 */
function getDistances(trigrams, languages, options) {
    var distances = [];
    var whitelist = options.whitelist || [];
    var blacklist = options.blacklist || [];
    var language;

    languages = filterLanguages(languages, whitelist, blacklist);

    for (language in languages) {
        distances.push([
            language,
            getDistance(trigrams, languages[language])
        ]);
    }

    return distances.length ? distances.sort(sort) : und();
}

/**
 * Get the occurrence ratio of `expression` for `value`.
 *
 * @param {string} value - Value to check.
 * @param {RegExp} expression - Code-point expression.
 * @return {number} Float between 0 and 1.
 */
function getOccurrence(value, expression) {
    var count = value.match(expression);

    return (count ? count.length : 0) / value.length || 0;
}

/**
 * From `scripts`, get the most occurring expression for
 * `value`.
 *
 * @param {string} value - Value to check.
 * @param {Object.<RegExp>} scripts - Top-Scripts.
 * @return {Array} Top script and its
 *   occurrence percentage.
 */
function getTopScript(value, scripts) {
    var topCount = -1;
    var topScript;
    var script;
    var count;

    for (script in scripts) {
        count = getOccurrence(value, scripts[script]);

        if (count > topCount) {
            topCount = count;
            topScript = script;
        }
    }

    return [topScript, topCount];
}

/**
 * Normalize the difference for each tuple in
 * `distances`.
 *
 * @param {string} value - Value to normalize.
 * @param {Array.<Array.<string, number>>} distances
 *   - List of distances.
 * @return {Array.<Array.<string, number>>} - Normalized
 *   distances.
 */
function normalize(value, distances) {
    var min = distances[0][1];
    var max = (value.length * MAX_DIFFERENCE) - min;
    var index = -1;
    var length = distances.length;

    while (++index < length) {
        distances[index][1] = 1 - ((distances[index][1] - min) / max) || 0;
    }

    return distances;
}

/**
 * Get a list of probable languages the given value is
 * written in.
 *
 * @param {string} value - The value to test.
 * @param {Object} options - Configuration.
 * @return {Array.<Array.<string, number>>} An array
 *   containing language--distance tuples.
 */
function detectAll(value, options) {
    var settings = options || {};
    var minLength = MIN_LENGTH;
    var script;

    if (settings.minLength !== null && settings.minLength !== undefined) {
        minLength = settings.minLength;
    }

    if (!value || value.length < minLength) {
        return und();
    }

    value = value.substr(0, MAX_LENGTH);

    /*
     * Get the script which characters occur the most
     * in `value`.
     */

    script = getTopScript(value, expressions);

    /*
     * One languages exists for the most-used script.
     *
     * If no matches occured, such as a digit only string,
     * exit with `und`.
     */

    if (!(script[0] in data)) {
        return script[1] === 0 ? und() : singleLanguageTuples(script[0]);
    }

    /*
     * Get all distances for a given script, and
     * normalize the distance values.
     */

    return normalize(value, getDistances(
        utilities.asTuples(value), data[script[0]], settings
    ));
}

/**
 * Get the most probable language for the given value.
 *
 * @param {string} value - The value to test.
 * @param {Object} options - Configuration.
 * @return {string} The most probable language.
 */
function detect(value, options) {
    return detectAll(value, options)[0][0];
}

/*
 * Expose `detectAll` on `detect`.
 */

detect.all = detectAll;

/*
 * Expose `detect`.
 */

module.exports = detect;
