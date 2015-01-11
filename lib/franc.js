'use strict';

var data,
    utilities,
    expressions;

/*
 * Load `trigram-utils`.
 */

utilities = require('trigram-utils');

/*
 * Load `expressions` (regular expressions matching
 * scripts).
 */

expressions = require('./expressions.js');

/*
 * Load `data` (trigram information per language,
 * per script).
 */

data = require('./data.json');

/*
 * Construct trigram dictionaries.
 */

(function () {
    var languages,
        name,
        trigrams,
        model,
        script,
        weight;

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

var MAX_LENGTH,
    MIN_LENGTH,
    MAX_DIFFERENCE;

/*
 * Maximum sample length.
 */

MAX_LENGTH = 2048;

/*
 * Minimum sample length.
 */

MIN_LENGTH = 10;

/*
 * The maximum distance to add when a given trigram does
 * not exist in a trigram dictionary.
 */

MAX_DIFFERENCE = 300;

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
 * Filter `languages` by removing languages in
 * `blacklist`, or including languages in `whitelist`.
 *
 * @param {Object.<string, Object>} languages - Languages
 *   to filter
 * @param {Array.<string>} whitelist - Whitelisted
 *   languages; if non-empty, only included languages
 *   are kept.
 * @param {Array.<string>} blacklist - Blacklisted
 *   languages; included languages are ignored.
 * @return {Object.<string, Object>} - Filtered array of
 *   languages.
 */
function filterLanguages(languages, whitelist, blacklist) {
    var filteredLanguages,
        language;

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
        } else {
            difference = MAX_DIFFERENCE;
        }

        distance += difference;
    }

    return distance;
}

/**
 * Get the distance between an array of trigram--count
 * tuples, and multiple trigram dictionaries.
 *
 * @param {Array.<Array.<string, number>>} trigrams - An
 *   array containing trigram--count tuples.
 * @param {Object.<string, Object>} languages - multiple
 *   trigrams to test against.
 * @return {Array.<Array.<string, number>>} An array
 *   containing language--distance tuples.
 */
function getDistances(trigrams, languages, options) {
    var distances,
        whitelist,
        blacklist,
        language;

    distances = [];
    whitelist = options.whitelist || [];
    blacklist = options.blacklist || [];
    languages = filterLanguages(languages, whitelist, blacklist);

    for (language in languages) {
        distances.push([
            language,
            getDistance(trigrams, languages[language])
        ]);
    }

    return distances.sort(sort);
}

/**
 * Get the occurrence ratio of `expression` for `value`.
 *
 * @param {string} value
 * @param {RegExp} expression
 * @return {number} Float between 0 and 1.
 */
function getOccurrence(value, expression) {
    var count;

    count = value.match(expression);

    return (count ? count.length : 0) / value.length || 0;
}

/**
 * From `scripts`, get the most occurring expression for
 * `value`.
 *
 * @param {string} value
 * @param {Object.<string, RegExp>} scripts
 * @return {Array} Top script and its
 *   occurrence percentage.
 */
function getTopScript(value, scripts) {
    var topCount,
        topScript,
        script,
        count;

    topCount = -1;

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
 * @param {string} value
 * @param {Array.<Array.<string, number>>} distances
 * @return {Array.<Array.<string, number>>} - Normalized
 *   distances.
 */
function normalize(value, distances) {
    var max,
        min,
        index,
        length;

    min = distances[0][1];

    max = (value.length * MAX_DIFFERENCE) - min;

    index = -1;
    length = distances.length;

    while (++index < length) {
        distances[index][1] = 1 - ((distances[index][1] - min) / max);
    }

    return distances;
}

/**
 * Create a single tuple as a list of tuples from a given
 * language code.
 *
 * @param {string} language - A single
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
function detectAll(value, options) {
    var script;

    if (!value || value.length < MIN_LENGTH) {
        return singleLanguageTuples('und');
    }

    value = value.substr(0, MAX_LENGTH);

    /*
     * Get the script which characters occur the most
     * in `value`.
     */

    script = getTopScript(value, expressions);

    /*
     * One languages exists for the most-used script.
     */

    if (!(script[0] in data)) {
        return singleLanguageTuples(script[0]);
    }

    /*
     * Get all distances for a given script, and
     * normalize the distance values.
     */

    return normalize(value, getDistances(
        utilities.asTuples(value), data[script[0]], options || {}
    ));
}

/**
 * Get the most probable language for the given value.
 *
 * @param {string} value - The value to test.
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
