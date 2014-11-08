'use strict';

/**
 * Dependencies.
 */

var fs,
    speakers,
    information,
    declarations,
    trigrams,
    scripts;

fs = require('fs');
speakers = require('speakers').all();
information = require('udhr').information();
declarations = require('udhr').json();
trigrams = require('trigrams').min();
scripts = require('unicode-7.0.0').scripts;

/**
 * Data.
 */

var topLanguages;

topLanguages = [];

/**
 * The minimum number of speakers to be included in
 * `franc`: 1,000,000.
 */

var THRESHOLD;

THRESHOLD = 1e6;

/**
 * Transform scripts into global expressions.
 */

var expressions;

expressions = {};

scripts.forEach(function (script) {
    var expression;

    expression = require('unicode-7.0.0/scripts/' + script + '/regex.js');

    expressions[script] = new RegExp(expression.source, 'g');
});

/**
 * Get script information.
 */

function all(object, key) {
    var results = [],
        property,
        value;

    for (property in object) {
        value = object[property];

        if (property === key) {
            results.push(value);
        } else if (typeof value === 'object') {
            results = results.concat(all(value, key));
        }
    }

    return results;
}

function getScriptInformation(code) {
    var declaration,
        content,
        length,
        scriptInformation;

    declaration = declarations[code];
    content = all(declaration, 'para').join('');
    length = content.length;
    scriptInformation = {};

    Object.keys(expressions).forEach(function (script) {
        var count;

        /**
         * Blacklisted, unimportant for our goal, scripts.
         */

        if (
            script === 'Common' ||
            script === 'Inherited'
        ) {
            return;
        }

        count = content.match(expressions[script]);

        count = (count ? count.length : 0) / length;

        count = Math.round(count * 100) / 100;

        if (count) {
            scriptInformation[script] = count;
        }
    });

    return scriptInformation;
}

/**
 * Get a UDHR key from an ISO code.
 */

var overrides;

overrides = {
    /**
     * It doesnt matter which one we take, simplified
     * or traditional. It all chinese, and all Han-script
     * characters/
     */

    'cmn': ['cmn_hans'],

    /**
     * Seems to be most popular in Nigeria:
     *
     * Source:
     *  http://www.ethnologue.com/language/hau
     */

    'hau': ['hau_NG'],

    /**
     * Monotonic Greek is modern greek.
     */

    'ell': ['ell_monotonic'],

    /**
     * More popular, Farsi/Persian, instead of Dari
     *
     * Source:
     *  http://www.ohchr.org/EN/UDHR/Pages/Language.aspx?LangID=prs1
     */

    'pes': ['pes_1'],

    /**
     * Asante: 2,800,000; Fante: 1,900,000; Akuapem: 555,000.
     *
     * Source:
     *   http://www.ethnologue.com/language/aka
     */

    'aka': ['aka_fante', 'aka_asante'],

    /**
     * Languages with one dated translation, pick the
     * newest:
     */

    'deu': ['deu_1996'],
    'ron': ['ron_2006'],

    /**
     * Pick European Portuguese, maybe not fair, will
     * have to investigate.
     */

    'por': ['por_PT'],

    /**
     * No real reason.
     *
     * Source:
     *   http://www.ethnologue.com/language/nya
     */

    'nya': ['nya_chinyanja'],

    /**
     * It says ``popular'' in the name?
     */

    'hat': ['hat_popular']
};

function getUDHRKeysfromISO(iso) {
    var udhrs;

    udhrs = [];

    if (iso in overrides) {
        return overrides[iso];
    }

    Object.keys(information).forEach(function (code) {
        var info;

        info = information[code];

        if (info.ISO === iso) {
            udhrs.push(code);
        }
    });

    if (udhrs.length === 1) {
        return udhrs;
    }

    /**
     * Pick the main UDHR.
     */

    if (udhrs.indexOf(iso) !== -1) {
        return [iso];
    }

    return udhrs;
}

/**
 * Sort a list of languages by most-popular.
 */

function sort(array) {
    return array.concat().sort(function (a, b) {
        var diff;

        diff = b.speakers - a.speakers;

        if (diff === 0) {
            diff = a.iso6393.charCodeAt(0) - b.iso6393.charCodeAt(0);
        }

        return diff;
    });
}

/**
 * Output.
 */

Object.keys(speakers).forEach(function (iso6393) {
    var language;

    language = speakers[iso6393];

    if (language.speakers >= THRESHOLD) {
        topLanguages.push({
            'speakers': language.speakers,
            'name': language.name,
            'iso6393': iso6393
        });
    } else {
        console.log(
            'Ignoring unpopular language `' + iso6393 + '` (' +
            language.name + '), which has ' + language.speakers +
            ' speakers.'
        );
    }
});

topLanguages.forEach(function (language) {
    var udhrs;

    udhrs = getUDHRKeysfromISO(language.iso6393);

    language.udhr = udhrs.pop();

    if (udhrs.length !== 0) {
        console.log(
            'Adding multiple UDHRs for `' +
            language.iso6393 + '`: ' +
            [language.udhr].concat(udhrs).join(', ')
        );

        udhrs.forEach(function (udhr) {
            topLanguages.push({
                'speakers': language.speakers,
                'name': language.name,
                'iso6393': language.iso6393,
                'udhr': udhr
            });
        });
    }
});

topLanguages = sort(topLanguages);

topLanguages.forEach(function (language) {
    var iso;

    iso = language.iso6393;

    language.script = getScriptInformation(language.udhr);

    /**
     * Languages without (accessible) UDHR declaration.
     */

    if (iso === 'tel') {
        language.script['Telugu'] = 0.8;
    }

    if (iso === 'ori') {
        language.script['Oriya'] = 0.8;
    }

    if (iso === 'sin') {
        language.script['Sinhala'] = 0.8;
    }

    if (iso === 'sat') {
        language.script['Ol_Chiki'] = 0.8;
    }

    /**
     * No trigram, and no custom script, available for:
     *
     * - awa (Awadhi): Devanagari, Kaithi, Persian;
     * - snd (Sindhi): Arabic, Devanagari, Khudabadi, and more;
     * - hne (Chhattisgarhi): Devanagari;
     * - asm (Assamese): Assamese (Bengali + two other characters*);
     * - koi (Komi-Permyak): Cyrillic;
     * - raj (Rajasthani): Devanagari;
     * - mve (Marwari): Devanagari, and Mahajani (which is in unicode*);
     * - bjj (Kanauji): Devanagari;
     * - kmr (Northern Kurdish): Latin (main); Perso-Arabic;
     * - kas (Kashmiri): Perso-Arabic, Devanagari, Sharada.
     * - shn (Shan): A Shan script exists, but nearly no one can read it*.
     * - gbm (Garhwali): Devanagari
     * - dyu (Dyula): N'Ko, Latin, Arabic
     * - ksw (S'gaw Karen): Burmese
     * - gno (Northern Gondi): Devanagari, Telugu
     * - bgp (Eastern Balochi): Urdu Arabic, Arabic
     * - unr (Mundari): ?
     * - hoc (Ho): Ol Chiki, Devanagari, Varang Kshiti
     * - pwo (Pwo Western Karen): Burmese
     *
     * *: future interest?
     */
});

/**
 * Detect which languages are unique per script.
 */

topLanguages = topLanguages.filter(function (language) {
    var hasScripts;

    hasScripts = Object.keys(language.script).length !== 0;

    if (!trigrams[language.udhr] && !hasScripts) {
        console.log(
            'Popular language with neither trigrams nor ' +
            'scripts: ' + language.iso6393
        );

        return false;
    }

    return true;
});

/**
 * Create a map of which languages should be supported.
 */

var languages = {};

topLanguages.forEach(function (language) {
    languages[language.iso6393] = language;
});

/**
 * Japanese is different.
 */

topLanguages.forEach(function (language) {
    if (language.iso6393 === 'jpn') {
        language.script = {
            'Hiragana, Katakana, and Han': 0.8
        };
    }
});

/**
 * Transform the scripts object into a single key.
 * Throw when more than one scripts are in use.
 */

topLanguages.forEach(function (language) {
    if (Object.keys(language.script).length > 1) {
        throw new Error(
            'Woops, I found a language which uses more than ' +
            'one script. Franc is not build for that. Exiting.'
        );
    }

    language.script = Object.keys(language.script)[0];
});

topLanguages = sort(topLanguages);

/**
 * Detect languages with unique scripts.
 */

var languagesByScripts;

languagesByScripts = {};

topLanguages.forEach(function (language) {
    var script;

    script = language.script;

    if (!languagesByScripts[script]) {
        languagesByScripts[script] = [];
    }

    languagesByScripts[script].push(language);
});

/**
 * Supported languages.
 */

var support;

support = [];

/**
 * Get languages by scripts.
 */

var data,
    regularExpressions;

data = {};
regularExpressions = {}; /* Ha! */

Object.keys(languagesByScripts).forEach(function (script) {
    var languagesByScript;

    languagesByScript = languagesByScripts[script];

    if (languagesByScript.length > 1) {
        if (!regularExpressions[script]) {
            regularExpressions[script] = expressions[script];
        }

        data[script] = languagesByScript;
    } else {
        support.push(languagesByScript[0]);

        regularExpressions[languagesByScript[0].iso6393] =
            expressions[script];
    }
});

/**
 * Push Japanese.
 */

regularExpressions.jpn = new RegExp(
    expressions.Hiragana.source + '|' +
    expressions.Katakana.source,
    'g'
);

/**
 * Write data.
 */

fs.writeFileSync('lib/expressions.js', (function () {
    var asString;

    asString = Object.keys(regularExpressions).map(function (script) {
        return script + ': ' + regularExpressions[script];
    }).join(',\n  ');

    return 'module.exports = {\n  ' + asString + '\n};\n';
})());

/**
 * Write info on which regular scripts belong to
 * which languages.
 */

fs.writeFileSync('lib/data.json', (function () {
    var languagesAsObject;

    languagesAsObject = {};

    Object.keys(data).forEach(function (script) {
        var scriptObject;

        scriptObject = {};

        data[script].forEach(function (language) {
            if (trigrams[language.udhr]) {
                support.push(language);

                scriptObject[language.iso6393] =
                    trigrams[language.udhr].concat().reverse().join('|');
            } else {
                console.log(
                    'Popular language without trigrams: ' +
                    language.iso6393
                );
            }
        });

        languagesAsObject[script] = scriptObject;
    });

    return JSON.stringify(languagesAsObject, 0, 2);
})());

/**
 * Write info on which languages are supported.
 */

fs.writeFileSync('data/support.json', JSON.stringify(sort(support), 0, 2));

console.log(
    'In total, franc now has support for ' +
    support.length +
    ' languages.'
);
