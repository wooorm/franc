'use strict';

/* eslint-disable camelcase */

/* Dependencies. */
var fs = require('fs');
var iso6393 = require('iso-639-3');
var speakers = require('speakers');
var information = require('udhr').information();
var declarations = require('udhr').json();
var trigrams = require('trigrams').min();
var scripts = require('unicode-7.0.0').Script;

/* Data. */
var topLanguages = [];

/* The minimum number of speakers to be included in
 * `franc`, defaulting to 1,000,000.
 * Can be passed in through an environment variable,
 * for example when executing the following:
 *
 * ```bash
 * export THRESHOLD=99999
 * npm run build
 * ```
 */
var THRESHOLD;

if (process.env.THRESHOLD) {
  THRESHOLD = Number(process.env.THRESHOLD);
}

if (THRESHOLD !== THRESHOLD || THRESHOLD === undefined) {
  THRESHOLD = 1e6;
}

console.log(
  'Franc will be created with support for languages ' +
  'with AT LEAST `' + THRESHOLD + '` speakers.'
);

/* Transform scripts into global expressions. */
var expressions = {};

scripts.forEach(function (script) {
  var expression = require('unicode-7.0.0/Script/' + script + '/regex.js');

  expressions[script] = new RegExp(expression.source, 'g');
});

var nameByCode = {};

iso6393.forEach(function (info) {
  nameByCode[info.iso6393] = info.name;
});

/**
 * Get all values at `key` properties in `object`.
 *
 * @param {Object} object - Context.
 * @param {string} key - Property.
 * @return {Array.<*>} - Results.
 */
function all(object, key) {
  var results = [];
  var property;
  var value;

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

/**
 * Get which scripts are used for a given UDHR code.
 *
 * @param {string} code - ISO 639 3
 * @return {Object.<string, number>} - Script information.
 */
function getScriptInformation(code) {
  var declaration = declarations[code];
  var content = all(declaration, 'para').join('');
  var length = content.length;
  var scriptInformation = {};

  Object.keys(expressions).forEach(function (script) {
    var count;

    /* Blacklisted, unimportant for our goal, scripts. */
    if (script === 'Common' || script === 'Inherited') {
      return;
    }

    count = content.match(expressions[script]);
    count = (count ? count.length : 0) / length;
    count = Math.round(count * 100) / 100;

    if (count && count > 0.05) {
      scriptInformation[script] = count;
    }
  });

  return scriptInformation;
}

/* Get a UDHR key from an ISO code. */
var overrides = {
  /* It doesnt matter which one we take, simplified
   * or traditional. It all chinese, and all Han-script
   * characters. */
  cmn: ['cmn_hans'],

  /* Seems to be most popular in Nigeria:
   * http://www.ethnologue.com/language/hau */
  hau: ['hau_NG'],

  /* Monotonic Greek is modern greek. */
  ell: ['ell_monotonic'],

  /* More popular, Farsi/Persian, instead of Dari
   * http://www.ohchr.org/EN/UDHR/Pages/Language.aspx?LangID=prs1 */
  pes: ['pes_1'],

  /* Asante: 2,800,000; Fante: 1,900,000; Akuapem: 555,000.
   * http://www.ethnologue.com/language/aka */
  aka: ['aka_fante', 'aka_asante'],

  /* Languages with one dated translation, pick the
   * newest */
  deu: ['deu_1996'],
  ron: ['ron_2006'],

  /* Pick European Portuguese, maybe not fair, will
   * have to investigate. */
  por: ['por_PT'],

  /* No real reason.
   * http://www.ethnologue.com/language/nya */
  nya: ['nya_chinyanja'],

  /* It says ``popular'' in the name? */
  hat: ['hat_popular']
};

/**
 * Sort a list of languages by most-popular.
 *
 * @param {string} iso - ISO 639 3.
 * @return {Array.<string>} - UDHR keys.
 */
function getUDHRKeysfromISO(iso) {
  var udhrs = [];

  if (iso in overrides) {
    return overrides[iso];
  }

  Object.keys(information).forEach(function (code) {
    var info = information[code];

    if (info.ISO === iso || info.code === iso) {
      udhrs.push(code);
    }
  });

  if (udhrs.length === 1) {
    return udhrs;
  }

  /* Pick the main UDHR. */
  if (udhrs.indexOf(iso) !== -1) {
    return [iso];
  }

  return udhrs;
}

/**
 * Sort a list of languages by most-popular.
 *
 * @param {Array.<string>} array - List.
 * @return {Array.<string>} - Sorted array.
 */
function sort(array) {
  return array.concat().sort(function (a, b) {
    var diff = b.speakers - a.speakers;

    if (diff === 0) {
      diff = a.iso6393.charCodeAt(0) - b.iso6393.charCodeAt(0);
    }

    return diff;
  });
}

/* Some languages are blacklisted, no matter what
 * `threshold` is chosen. */
var BLACKLIST = [
  /* `cbs` and `prq` have the same entries:
   *
   * - http://www.ohchr.org/EN/UDHR/Pages/Language.aspx?LangID=cbs
   * - http://www.ohchr.org/EN/UDHR/Pages/Language.aspx?LangID=cpp
   * - http://www.unicode.org/udhr/d/udhr_cbs.txt
   * - http://www.unicode.org/udhr/d/udhr_prq.txt
   *
   * To date (9 november, 2014), I have no idea which
   * is which, thus I cannot guarantee if they will
   * work.
   *
   * I've sent an e-mail out to OHCHR and am waiting
   * for an answer. */
  'cbs',
  'prq'
];

/* Output. */
Object.keys(speakers).forEach(function (code) {
  var count = speakers[code];
  var name = nameByCode[code];

  if (BLACKLIST.indexOf(code) !== -1) {
    console.log(
      'Ignoring unsafe language `' + code + '` (' + name + '), which has ' +
      count + ' speakers. See the code for reasoning.'
    );

    return;
  }

  if (count >= THRESHOLD) {
    topLanguages.push({
      speakers: count,
      name: name,
      iso6393: code
    });
  } else {
    console.log(
      'Ignoring unpopular language `' + code + '` (' + name + '), which has ' +
      count + ' speakers.'
    );
  }
});

topLanguages.forEach(function (language) {
  var udhrs = getUDHRKeysfromISO(language.iso6393);

  language.udhr = udhrs.pop();

  if (udhrs.length !== 0) {
    console.log(
      'Adding multiple UDHRs for `' +
      language.iso6393 + '`: ' +
      [language.udhr].concat(udhrs).join(', ')
    );

    udhrs.forEach(function (udhr) {
      topLanguages.push({
        speakers: language.speakers,
        name: language.name,
        iso6393: language.iso6393,
        udhr: udhr
      });
    });
  }
});

topLanguages = sort(topLanguages);

topLanguages.forEach(function (language) {
  var iso = language.iso6393;

  language.script = getScriptInformation(language.udhr);

  /* Languages without (accessible) UDHR declaration. */
  if (iso === 'tel') {
    language.script.Telugu = 0.8;
  }

  if (iso === 'ori') {
    language.script.Oriya = 0.8;
  }

  if (iso === 'sin') {
    language.script.Sinhala = 0.8;
  }

  if (iso === 'sat') {
    language.script.Ol_Chiki = 0.8;
  }

  /* No trigram, and no custom script, available for:
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

/* Detect which languages are unique per script. */
topLanguages = topLanguages.filter(function (language) {
  var hasScripts = Object.keys(language.script).length !== 0;

  if (!trigrams[language.udhr] && !hasScripts) {
    console.log(
      'Ignoring language with neither trigrams nor ' +
      'scripts: ' + language.iso6393 + ' (' +
      language.name + ')'
    );

    return false;
  }

  return true;
});

/* Create a map of which languages should be supported. */
var languages = {};

topLanguages.forEach(function (language) {
  languages[language.iso6393] = language;
});

/* Japanese is different. */
topLanguages.forEach(function (language) {
  if (language.iso6393 === 'jpn') {
    language.script = {'Hiragana, Katakana, and Han': 0.8};
  }
});

/* Transform the scripts object into a single key.
 * Throw when more than one scripts are in use. */
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

/* Detect languages with unique scripts. */
var languagesByScripts = {};

topLanguages.forEach(function (language) {
  var script = language.script;

  if (!languagesByScripts[script]) {
    languagesByScripts[script] = [];
  }

  languagesByScripts[script].push(language);
});

/* Supported languages. */
var support = [];

/* Get languages by scripts. */
var data = {};
var regularExpressions = {}; /* Ha! */

Object.keys(languagesByScripts).forEach(function (script) {
  var languagesByScript = languagesByScripts[script];

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

/* Push Japanese. */
regularExpressions.jpn = new RegExp(
  expressions.Hiragana.source + '|' +
  expressions.Katakana.source,
  'g'
);

/* Write data. */
fs.writeFileSync('lib/expressions.js', (function () {
  var asString = Object.keys(regularExpressions).map(function (script) {
    return script + ': ' + regularExpressions[script];
  }).join(',\n  ');

  return 'module.exports = {\n' +
    '  ' + asString + '\n' +
    '};\n';
})());

/*
* Write info on which regular scripts belong to
* which languages.
*/

fs.writeFileSync('lib/data.json', (function () {
  var languagesAsObject = {};

  Object.keys(data).forEach(function (script) {
    var scriptObject = {};

    data[script].forEach(function (language) {
      if (trigrams[language.udhr]) {
        support.push(language);

        scriptObject[language.iso6393] =
          trigrams[language.udhr].concat().reverse().join('|');
      } else {
        console.log(
          'Ignoring language without trigrams: ' +
          language.iso6393 + ' (' + language.name +
          ')'
        );
      }
    });

    languagesAsObject[script] = scriptObject;
  });

  return JSON.stringify(languagesAsObject, 0, 2);
})());

/*
* Write info on which languages are supported.
*/

fs.writeFileSync('data/support.json', JSON.stringify(sort(support), 0, 2));

console.log(
  'In total, franc now has support for ' +
  support.length +
  ' languages.'
);
