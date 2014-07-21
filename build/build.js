/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("wooorm~franc@0.1.0", function (exports, module) {
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
    MAX_LENGTH, MIN_LENGTH, MAX_DIFFERENCE, SINGLETONS, UNDETERMINED,
    ALL_LATIN, CYRILLIC, ARABIC, DEVANAGARI, PT,
    unicodeBlocks, singletonsLength, unicodeBlockCount;

models = require("wooorm~franc@0.1.0/data.json");

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
 * Get trigrams from a given value.
 *
 * @example Pads the start and end of the value.
 *     getTrigrams('a') // ['  a', ' a ', 'a  '];
 *
 * @param {string} value
 * @return {string[]} - An array containing the trigrams;
 * @api private
 */
function getTrigrams(value) {
    var iterator = -3,
        trigrams = [],
        length;

    value = value.split('');
    length = value.length;

    while (++iterator < length) {
        trigrams[iterator + 2] = (value[iterator] || ' ') +
            (value[iterator + 1] || ' ') +
            (value[iterator + 2] || ' ');
    }

    return trigrams;
}

/**
 * Get an object with trigrams as its attributes, and their occurence count
 * as their values
 *
 * @param {string} value
 * @return {Object.<string, number>} - Object containing weighted trigrams.
 * @api private
 */
function getObjectModel(value) {
    var trigrams = getTrigrams(value),
        objectModel = {},
        iterator = -1,
        length = trigrams.length,
        trigram;

    while (++iterator < length) {
        trigram = trigrams[iterator];

        if (trigram in objectModel) {
            objectModel[trigram]++;
        } else {
            objectModel[trigram] = 1;
        }
    }

    return objectModel;
}

/**
 * Get the array containing trigram--count tuples from a given value.
 *
 * @param {string} value
 * @return {Array<string, number>[]} - An array containing trigram--count
 *     tupples.
 * @api private
 */
function getCountedTrigrams(value) {
    var objectModel = getObjectModel(value),
        countedTrigrams = [],
        trigram;

    for (trigram in objectModel) {
        countedTrigrams.push([trigram, objectModel[trigram]]);
    }

    return countedTrigrams;
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

    value = value
        .substr(0, MAX_LENGTH)
        .replace(/[\u0021-\u0040]+/g, '')
        .toLowerCase();

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

    trigrams = getCountedTrigrams(value);

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

});

require.define("wooorm~franc@0.1.0/data.json", {
    "af": "ie | di|die|en |ing|an | en|van| va|ng |te |n d|ver|er |e v| ge| be|de | ve|nde| in| te|le |der|ers|et |oor| 'n|'n |at |eer|ste|ord|aar|sie| wa|es |e s|aan| on|is |in |e o|rde|e b|asi|rin|ond|e w|el | is|and|e e|eid|e d|om |ke | om|eri| wo|e g|r d|ale|wat| vo|id |it |rd | aa|lik| we|t d| op|e t|ngs|se |end|uit| st| le|ens|ter| re|e a|ies|wor|g v|sta|n s| na| pr|n o| me|al |of | vi|erd|lee|e k| de|ite|erk|ik |e r|e p|n v|e i|e n|een|eli|wer| of| da|tel|nie|ike|s e|taa|ge |vir|hei|ir |reg|ede|s v|ur |pro|ele|ion|wet|e l| mo|e m|daa|sio|s d| he| to|ent|ard|nge| oo|eur|lle|ien|n b|eke|lin|raa| ni|ont|bes|rdi|voo|ns |n a|del|dig|nas| sa| gr|nis|kom| ui|men|op |ins|ona|ere|s o| so|n g|ig |moe| ko|rs |ges|nal|vol|e h|geb|rui|ang|ige|oet|ar |wys|lig|as |n w| as|met|gs |deu|t v|aal|erw|dit|ken|sse|kel| hu|ewe|din|n t| se|est|ika|n p|ntw|t i|eni| ka|n e|doe|ali|eme|gro|nte| ho|nsi|gen|ier|gew|n h|or | ma|ind|ne |ek |aat|n '| sk|ide| ta|dat|ska|ger|soo|n k|s i| af|tee|nd |eel|hul|nee|woo|rik|d v|n m|re |art|ebr|lan|kke|ron|aam|tre|str|kan|ree|lei|t o|gra|het|evo|tan|den|ist| do|bru|toe|olg|rsk|uik|rwy|min|lge|g e|g o|nst|r v|gte|waa|we |ans|esi|ese|voe|epa|gel| hi|vin|nse|s w|s t|tei|eit|pre",
    "ar": " ال|الع|لعر|عرا|راق| في|في |ين |ية |ن ا|الم|ات |من |ي ا| من|الأ|ة ا|اق | وا|اء |الإ| أن|وال|ما | عل|لى |ت ا|ون |هم |اقي|ام |ل ا|أن |م ا|الت|لا |الا|ان |ها |ال |ة و|ا ا|رها|لام|يين| ول|لأم|نا |على|ن ي|الب|اد |الق|د ا|ذا |ه ا| با|الد|ب ا|مري|لم | إن| لل|سلا|أمر|ريك|مة |ى ا|ا ي| عن| هذ|ء ا|ر ا|كان|قتل|إسل|الح|وا | إل|ا أ|بال|ن م|الس|رة |لإس|ن و|هاب|ي و|ير | كا|لة |يات| لا|انت|ن أ|يكي|الر|الو|ة ف|دة |الج|قي |وي |الذ|الش|امي|اني|ذه |عن |لما|هذه|ول |اف |اوي|بري|ة ل| أم| لم| ما|يد | أي|إره|ع ا|عمل|ولا|إلى|ابي|ن ف|ختط|لك |نه |ني |إن |دين|ف ا|لذي|ي أ|ي ب| وأ|ا ع|الخ|تل |تي |قد |لدي| كل| مع|اب |اخت|ار |الن|علا|م و|مع |س ا|كل |لاء|ن ب|ن ت|ي م|عرب|م ب| وق| يق|ا ل|ا م|الف|تطا|داد|لمس|له |هذا| مح|ؤلا|بي |ة م|ن ل|هؤل|كن |لإر|لتي| أو| ان| عم|ا ف|ة أ|طاف|عب |ل م|ن ع|ور |يا | يس|ا ت|ة ب|راء|عال|قوا|قية|لعا|م ي|مي |مية|نية|أي |ابا|بغد|بل |رب |عما|غدا|مال|ملي|يس | بأ| بع| بغ| وم|بات|بية|ذلك|عة |قاو|قيي|كي |م م|ي ع| عر| قا|ا و|رى |ق ا|وات|وم | هؤ|ا ب|دام|دي |رات|شعب|لان|لشع|لقو|ليا|ن ه|ي ت|ي ي| وه| يح|جرا|جما|حمد|دم |كم |لاو|لره|ماع|ن ق|نة |هي | بل| به| له| وي|ا ك|اذا|اع |ت م|تخا|خاب|ر م|لمت|مسل|ى أ|يست|يطا| لأ| لي|أمن|است|بعض|ة ت|ري |صدا|ق و|قول|مد |نتخ|نفس|نها|هنا|أعم|أنه|ائن|الآ|الك|حة |د م|ر ع|ربي",
    "az": "lər|in |ın |lar|da |an |ir |də |ki | bi|ən |əri|arı|ər |dir|nda| ki|rin|nın|əsi|ini| ed| qa| tə| ba| ol|ası|ilə|rın| ya|anı| və|ndə|ni |ara|ını|ınd| bu|si |ib |aq |dən|iya|nə |rə |n b|sın|və |iri|lə |nin|əli| de| mü|bir|n s|ri |ək | az| sə|ar |bil|zər|bu |dan|edi|ind|man|un |ərə| ha|lan|yyə|iyy| il| ne|r k|ə b| is|na |nun|ır | da| hə|a b|inə|sin|yan|ərb| də| mə| qə|dır|li |ola|rba|azə|can|lı |nla| et| gö|alı|ayc|bay|eft|ist|n i|nef|tlə|yca|yət|əcə| la|ild|nı |tin|ldi|lik|n h|n m|oyu|raq|ya |əti| ar|ada|edə|mas|sı |ına|ə d|ələ|ayı|iyi|lma|mək|n d|ti |yin|yun|ət |azı|ft |i t|lli|n a|ra | cə| gə| ko| nə| oy|a d|ana|cək|eyi|ilm|irl|lay|liy|lub|n ə|ril|rlə|unu|ver|ün |ə o|əni| he| ma| on| pa|ala|dey|i m|ima|lmə|mət|par|yə |ətl| al| mi| sa| əl|adı|akı|and|ard|art|ayi|i a|i q|i y|ili|ill|isə|n o|n q|olu|rla|stə|sə |tan|tel|yar|ədə| me| rə| ve| ye|a k|at |baş|diy|ent|eti|həs|i i|ik |la |miş|n n|nu |qar|ran|tər|xan|ə a|ə g|ə t| dü|ama|b k|dil|era|etm|i b|kil|mil|n r|qla|r s|ras|siy|son|tim|yer|ə k| gü| so| sö| te| xa|ai |bar|cti|di |eri|gör|gün|gəl|hbə|ihə|iki|isi|lin|mai|maq|n k|n t|n v|onu|qan|qəz|tə |xal|yib|yih|zet|zır|ıb |ə m|əze| br| in| ir| pr| ta| to| üç|a o|ali|ani|anl|aql|azi|bri",
    "bg": "на | на|то | пр| за|та | по|ите|те |а п|а с| от|за |ата|ия | в |е н| да|а н| се| ко|да |от |ани|пре|не |ени|о н|ни |се | и |но |ане|ето|а в|ва |ван|е п|а о|ото|ран|ат |ред| не|а д|и п| до|про| съ|ли |при|ния|ски|тел|а и|по |ри | е | ка|ира|кат|ние|нит|е з|и с|о с|ост|че | ра|ист|о п| из| са|е д|ини|ки |мин| ми|а б|ава|е в|ие |пол|ств|т н| въ| ст| то|аза|е о|ов |ст |ът |и н|ият|нат|ра | бъ| че|алн|е с|ен |ест|и д|лен|нис|о о|ови| об| сл|а р|ато|кон|нос|ров|ще | ре| с | сп|ват|еше|и в|иет|о в|ове|ста|а к|а т|дат|ент|ка |лед|нет|ори|стр|стъ|ти |тър| те|а з|а м|ад |ана|ено|и о|ина|ити|ма |ска|сле|тво|тер|ция|ят | бе| де| па|ате|вен|ви |вит|и з|и и|нар|нов|ова|пов|рез|рит|са |ята| го| ще|али|в п|гра|е и|еди|ели|или|каз|кит|лно|мен|оли|раз| ве| гр| им| ме| пъ|ави|ако|ача|вин|во |гов|дан|ди |до |ед |ери|еро|жда|ито|ков|кол|лни|мер|нач|о з|ола|он |она|пра|рав|рем|сия|сти|т п|тан|ха |ше |шен|ълг| ба| си|аро|бъл|в р|гар|е е|елн|еме|ико|има|ко |кои|ла |лга|о д|ози|оит|под|рес|рие|сто|т к|т м|т с|уст| би| дв| дъ| ма| мо| ни| ос|ала|анс|ара|ати|аци|беш|вър|е р|едв|ема|жав|и к|иал|ица|иче|кия|лит|о б|ово|оди|ока|пос|род|сед|слу|т и|тов|ува|циа|чес|я з| во| ил| ск| тр| це|ами|ари|бат|би |бра|бъд",
    "ca": " de|es |de |la | la|el |que| el| co|ent|s d| qu| i |en |er | a |ls |nt | pe|e l|a d| en|per|ci |ar |ue |al | se|est|at | es|ts | s | pr|aci| un|res|men|s e|del|s a|s p| re|les| l'|na |a l| ca| d'|els|a p|ia |ns |con| le|tat|a c|i d|a a|ra |a e| no|ant| al|t d|s i| di|ta |re |a s|com|s c|ita|ons|sta|ica| po|r a| in|pro|tre| pa|ues|amb|ion|des|un | ma|da |s s|a i|an |mb | am|l d|e d|va |pre|ter|e e|e c|a m|cia|una|i e|nci|tra| te|ona|os |t e|n e|l c|ca |cio|l p| tr|par|r l|t a|e p|aqu|nta| so|ame|era|r e|e s|ada|n a|s q| si| ha|als|tes| va| m |ici|nte|s l|s m|i a|or | mo|ist|ect|lit|m s| to|ir |a t|esp|ran|str|om |l s|st |nts| me|no |r d|d'a|l'a|ats|ria|s t| ta|sen|rs |eix|tar|s n|n l|tal|e a|t p|art| mi| ll|tic|ten|ser| aq|ina|ntr|a f|sti|ol |a q|for|ura|ers|ari|int|act|l'e| fi|r s|e t|tor|si |ste|rec|a r| fe|is |em |n d|car|bre| fo| vi| an|ali|i p|ix |ell|l m|pos|orm|l l|i l| ac|fer|s r|ess|eu |e m|ens|ara|eri|sa |ssi|us |ort|tot|ll |por|ora| ci|tan|ass|n c|ost|nes|rac|a u|ver|ont|ha | ti|itz|gra|t c| n |a v|ren|cat|nal| ri|qua|t l| do|t s|rma|ual|i s|s f|n p|s v|te |t i| ba|cte|tam|man|l t|ial| fa|ic | ve|ble|a n|all|tza|ies| s'|le |omp|r c| nc|rti|it |rre|fic|any|on | sa|r p|tur",
    "ceb": "ng |sa | sa|ang|ga |nga| ka| ng|an | an| na| ma| ni|a s|a n|on | pa| si|a k|a m| ba|ong|a i|ila| mg|mga|a p|iya|a a|ay |ka |ala|ing|g m|n s|g n|lan| gi|na |ni |o s|g p|n n| da|ag |pag|g s|yan|ayo|o n|si | mo|a b|g a|ail|g b|han|a d|asu|nag|ya |man|ne |pan|kon| il| la|aka|ako|ana|bas|ko |od |yo | di| ko| ug|a u|g k|kan|la |len|sur|ug | ai|apa|aw |d s|g d|g g|ile|nin| iy| su|ene|og |ot |aba|aha|as |imo| ki|a t|aga|ban|ero|nan|o k|ran|ron|sil|una|usa| us|a g|ahi|ani|er |ha |i a|rer|yon| pu|ini|nak|ro |to |ure| ed| og| wa|ili|mo |n a|nd |o a| ad| du| pr|aro|i s|ma |n m|ulo|und| ta|ara|asa|ato|awa|dmu|e n|edm|ina|mak|mun|niy|san|wa | tu| un|a l|bay|iga|ika|ita|kin|lis|may|os | ar|ad |ali|ama|ers|ipa|isa|mao|nim|t s|tin| ak| ap| hi|abo|agp|ano|ata|g i|gan|gka|gpa|i m|iha|k s|law|or |rs |siy|tag| al| at| ha| hu| im|a h|bu |e s|gma|kas|lag|mon|nah|ngo|r s|ra |sab|sam|sul|uba|uha| lo| re|ada|aki|aya|bah|ce |d n|lab|pa |pak|s n|s s|tan|taw|te |uma|ura| in| lu|a c|abi|at |awo|bat|dal|dla|ele|g t|g u|gay|go |hab|hin|i e|i n|kab|kap|lay|lin|nil|pam|pas|pro|pul|ta |ton|uga|ugm|unt| co| gu| mi| pi| ti|a o|abu|adl|ado|agh|agk|ao |art|bal|cit|di |dto|dun|ent|g e|gon|gug|ia |iba|ice|in |inu|it |kaa",
    "cs": " pr| po|ní |pro| na|na | př|ch | je| ne|že | že| se| do| ro| st| v | ve|pře|se |ho |sta| to| vy| za|ou | a |to | by|la |ce |e v|ist|le |pod|í p| vl|e n|e s|je |ké |by |em |ých| od|ova|řed|dy |ení|kon|li |ně |str| zá|ve | ka| sv|e p|it |lád|oho|rov|roz|ter|vlá|ím | ko|hod|nis|pří|ský| mi| ob| so|a p|ali|bud|edn|ick|kte|ku |o s|al |ci |e t|il |ny |né |odl|ová|rot|sou|ání| bu| mo| o |ast|byl|de |ek |ost| mí| ta|es |jed|ky |las|m p|nes|ním|ran|rem|ros|ého| de| kt| ni| si| vý|at |jí |ký |mi |pre|tak|tan|y v|řek| ch| li| ná| pa| ře|da |dle|dne|i p|i v|ly |min|o n|o v|pol|tra|val|vní|ích|ý p|řej| ce| kd| le|a s|a z|cen|e k|eds|ekl|emi|kl |lat|lo |mié|nov|pra|sku|ské|sti|tav|ti |ty |ván|vé |y n|y s|í s|í v|ě p| dn| ně| sp| čs|a n|a t|ak |dní|doh|e b|e m|ejn|ena|est|ini|m z|nal|nou|ná |ovi|ové|ový|rsk|stá|tí |tře|tů |ude|za |é p|ém |í d| ir| zv|ale|aně|ave|cké|den|e z|ech|en |erý|hla|i s|iér|lov|mu |neb|nic|o b|o m|pad|pot|rav|rop|rý |sed|si |t p|tic|tu |tě |u p|u v|vá |výš|zvý|ční|ří |ům | bl| br| ho| ja| re| s | z | zd|a v|ani|ato|bla|bri|ečn|eře|h v|i n|ie |ila|irs|ite|kov|nos|o o|o p|oce|ody|ohl|oli|ovo|pla|poč|prá|ra |rit|rod|ry |sd |sko|ssd|tel|u s|vat|veř|vit|vla|y p|áln|čss|šen| al",
    "cy": "yn |dd | yn| y |ydd|eth|th | i |aet|d y|ch |od |ol |edd| ga| gw|'r |au |ddi|ad | cy| gy| ei| o |iad|yr |an |bod|wed| bo| dd|el |n y| am|di |edi|on | we| ym| ar| rh|odd| ca| ma|ael|oed|dae|n a|dda|er |h y|all|ei | ll|am |eu |fod|fyd|l y|n g|wyn|d a|i g|mae|neu|os | ne|d i|dod|dol|n c|r h|wyd|wyr|ai |ar |in |rth| fy| he| me| yr|'n |dia|est|h c|hai|i d|id |r y|y b| dy| ha|ada|i b|n i|ote|rot|tes|y g|yd | ad| mr| un|cyn|dau|ddy|edo|i c|i w|ith|lae|lla|nd |oda|ryd|tho| a | dr|aid|ain|ddo|dyd|fyn|gyn|hol|io |o a|wch|wyb|ybo|ych| br| by| di| fe| na| o'| pe|art|byd|dro|gal|l e|lai|mr |n n|r a|rhy|wn |ynn| on| r |cae|d g|d o|d w|gan|gwy|n d|n f|n o|ned|ni |o'r|r d|ud |wei|wrt| an| cw| da| ni| pa| pr| wy|d e|dai|dim|eud|gwa|idd|im |iri|lwy|n b|nol|r o|rwy| ch| er| fo| ge| hy| i'| ro| sa| tr|bob|cwy|cyf|dio|dyn|eit|hel|hyn|ich|ll |mdd|n r|ond|pro|r c|r g|red|rha|u a|u c|u y|y c|ymd|ymr|yw | ac| be| bl| co| os|adw|ae |af |d p|efn|eic|en |eol|es |fer|gel|h g|hod|ied|ir |laf|n h|na |nyd|odo|ofy|rdd|rie|ros|stw|twy|yda|yng| at| de| go| id| oe| â |'ch|ac |ach|ae'|al |bl |d c|d l|dan|dde|ddw|dir|dla|ed |ela|ell|ene|ewn|gyd|hau|hyw|i a|i f|iol|ion|l a|l i|lia|med|mon|n s|no |obl|ola|ref|rn |thi|un ",
    "da": "er |en | de|et |der|de |for| fo| i |at | at|re |det| ha|nde|ere|ing|den| me| og|ger|ter| er| si|and| af|or | st| ti| en|og |ar |il |r s|ige|til|ke |r e|af |kke| ma| på|om |på |ed |ge |end|nge|t s|e s|ler| sk|els|ern|sig|ne |lig|r d|ska| vi|har| be| se|an |ikk|lle|gen|n f|ste|t a|t d|rin| ik|es |ng |ver|r b|sen|ede|men|r i| he| et|ig |lan|med|nd |rne| da| in|e t|mme|und| om|e e|e m|her|le |r f|t f|så |te | so|ele|t e| ko|est|ske| bl|e f|ekt|mar|bru|e a|el |ers|ret|som|tte|ve | la| ud| ve|age|e d|e h|lse|man|rug|sel|ser| fi| op| pr|dt |e i|n m|r m| an| re| sa|ion|ner|res|t i|get|n s|one|orb|t h|vis|år | fr|bil|e k|ens|ind|omm|t m| hv| je|dan|ent|fte|nin| mi|e o|e p|n o|nte| ku|ell|nas|ore|r h|r k|sta|sto|dag|eri|kun|lde|mer|r a|r v|rek|rer|t o|tor|tør| få| må| to|boe|che|e v|i d|ive|kab|ns |oel|se |t v| al| bo| un|ans|dre|ire|køb|ors|ove|ren|t b|ør | ka|ald|bet|gt |isk|kal|kom|lev|n d|n i|pri|r p|rbr|søg|tel| så| te| va|al |dir|eje|fis|gså|isc|jer|ker|ogs|sch|st |t k|uge| di|ag |d a|g i|ill|l a|lsk|n a|on |sam|str|tet|var| mo|art|ash|att|e b|han|hav|kla|kon|n t|ned|r o|ra |rre|ves|vil| el| kr| ov|ann|e u|ess|fra|g a|g d|int|ngs|rde|tra| år|akt|asi|em |gel|gym|hol|kan|mna|n h|nsk|old",
    "de": "en |er | de|der|ie | di|die|sch|ein|che|ich|den|in |te |ch | ei|ung|n d|nd | be|ver|es | zu|eit|gen|und| un| au| in|cht|it |ten| da|ent| ve|and| ge|ine| mi|r d|hen|ng |nde| vo|e d|ber|men|ei |mit| st|ter|ren|t d| er|ere|n s|ste| se|e s|ht |des|ist|ne |auf|e a|isc|on |rte| re| we|ges|uch| fü| so|bei|e e|nen|r s|ach|für|ier|par|ür | ha|as |ert| an| pa| sa| sp| wi|for|tag|zu |das|rei|he |hre|nte|sen|vor| sc|ech|etz|hei|lan|n a|pd |st |sta|ese|lic| ab| si|gte| wa|iti|kei|n e|nge|sei|tra|zen| im| la|art|im |lle|n w|rde|rec|set|str|tei|tte| ni|e p|ehe|ers|g d|nic|von| al| pr|an |aus|erf|r e|tze|tür|uf |ag |als|ar |chs|end|ge |ige|ion|ls |n m|ngs|nis|nt |ord|s s|sse| tü|ahl|e b|ede|em |len|n i|orm|pro|rke|run|s d|wah|wer|ürk| me|age|att|ell|est|hat|n b|oll|raf|s a|tsc| es| fo| gr| ja|abe|auc|ben|e n|ege|lie|n u|r v|re |rit|sag| am|agt|ahr|bra|de |erd|her|ite|le |n p|n v|or |rbe|rt |sic|wie|übe| is| üb|cha|chi|e f|e m|eri|ied|mme|ner|r a|sti|t a|t s|tis| ko|arb|ds |gan|n z|r f|r w|ran|se |t i|wei|wir| br| np|am |bes|d d|deu|e g|e k|efo|et |eut|fen|hse|lte|n r|npd|r b|rhe|t w|tz | fr| ih| ke| ma|ame|ang|d s|eil|el |era|erh|h d|i d|kan|n f|n l|nts|och|rag|rd |spd|spr|tio| ar| en| ka|ark|ass",
    "en": " th|the|he |ed | to| in|er |ing|ng | an|nd | of|and|to |of | co|at |on |in | a |d t| he|e t|ion|es | re|re |hat| sa| st| ha|her|tha|tio|or | ''|en | wh|e s|ent|n t|s a|as |for|is |t t| be|ld |e a|rs | wa|ut |ve |ll |al | ma|e i| fo|'s |an |est| hi| mo| se| pr|s t|ate|st |ter|ere|ted|nt |ver|d a| wi|se |e c|ect|ns | on|ly |tol|ey |r t| ca|ati|ts |all| no|his|s o|ers|con|e o|ear|f t|e w|was|ons|sta|'' |sti|n a|sto|t h| we|id |th | it|ce | di|ave|d h|cou|pro|ad |oll|ry |d s|e m| so|ill|cti|te |tor|eve|g t|it | ch| de|hav|oul|ty |uld|use| al|are|ch |me |out|ove|wit|ys |chi|t a|ith|oth| ab| te| wo|s s|res|t w|tin|e b|e h|nce|t s|y t|e p|ele|hin|s i|nte| li|le | do|aid|hey|ne |s w| as| fr| tr|end|sai| el| ne| su|'t |ay |hou|ive|lec|n't| ye|but|d o|o t|y o| ho| me|be |cal|e e|had|ple| at| bu| la|d b|s h|say|t i| ar|e f|ght|hil|igh|int|not|ren| is| pa| sh|ays|com|n s|r a|rin|y a| un|n c|om |thi| mi|by |d i|e d|e n|t o| by|e r|eri|old|ome|whe|yea| gr|ar |ity|mpl|oun|one|ow |r s|s f|tat| ba| vo|bou|sam|tim|vot|abo|ant|ds |ial|ine|man|men| or| po|amp|can|der|e l|les|ny |ot |rec|tes|tho|ica|ild|ir |nde|ose|ous|pre|ste|era|per|r o|red|rie| bo| le|ali|ars|ore|ric|s m|str| fa|ess|ie |ist|lat|uri",
    "es": " de|de | la|os |la |el |es | qu| co|e l|as |que| el|ue |en |ent| en| se|nte|res|con|est| es|s d| lo| pr|los| y |do |ón |ión| un|ció|del|o d| po|a d|aci|sta|te |ado|pre|to |par|a e|a l|ra |al |e e|se |pro|ar |ia |o e| re|ida|dad|tra|por|s p| a |a p|ara|cia| pa|com|no | di| in|ien|n l|ad |ant|e s|men|a c|on |un |las|nci| tr|cio|ier|nto|tiv|n d|n e|or |s c|enc|ern|io |a s|ici|s e| ma|dos|e a|e c|emp|ica|ivo|l p|n c|r e|ta |ter|e d|esa|ez |mpr|o a|s a| ca| su|ion| cu| ju|an |da |ene|ero|na |rec|ro |tar| al| an|bie|e p|er |l c|n p|omp|ten| em|ist|nes|nta|o c|so |tes|era|l d|l m|les|ntr|o s|ore|rá |s q|s y|sto|a a|a r|ari|des|e q|ivi|lic|lo |n a|one|ora|per|pue|r l|re |ren|una|ía |ada|cas|ere|ide|min|n s|ndo|ran|rno| ac| ex| go| no|a t|aba|ble|ece|ect|l a|l g|lid|nsi|ons|rac|rio|str|uer|ust| ha| le| mi| mu| ob| pe| pu| so|a i|ale|ca |cto|e i|e u|eso|fer|fic|gob|jo |ma |mpl|o p|obi|s m|sa |sep|ste|sti|tad|tod|y s| ci|and|ces|có |dor|e m|eci|eco|esi|int|iza|l e|lar|mie|ner|orc|rci|ria|tic|tor| as| si|ce |den|e r|e t|end|eri|esp|ial|ido|ina|inc|mit|o l|ome|pli|ras|s t|sid|sup|tab|uen|ues|ura|vo |vor| sa| ti|abl|ali|aso|ast|cor|cti|cue|div|duc|ens|eti|imi|ini|lec|o q|oce|ort|ral|rma|roc|rod",
    "et": "st | ka|on |ja | va| on| ja| ko|se |ast|le |es |as |is |ud | sa|da |ga | ta|aja|sta| ku| pe|a k|est|ist|ks |ta |al |ava|id |saa|mis|te |val| et|nud| te|inn| se| tu|a v|alu|e k|ise|lu |ma |mes| mi|et |iku|lin|ad |el |ime|ne |nna| ha| in| ke| võ|a s|a t|ab |e s|esi| la| li|e v|eks|ema|las|les|rju|tle|tsi|tus|upa|use|ust|var| lä|ali|arj|de |ete|i t|iga|ilm|kui|li |tul| ei| me| sõ|aal|ata|dus|ei |nik|pea|s k|s o|sal|sõn|ter|ul |või| el| ne|a j|ate|end|i k|ita|kar|kor|l o|lt |maa|oli|sti|vad|ään| ju| jä| kü| ma| po| üt|aas|aks|at |ed |eri|hoi|i s|ka |la |nni|oid|pai|rit|us |ütl| aa| lo| to| ve|a e|ada|aid|ami|and|dla|e j|ega|gi |gu |i p|idl|ik |ini|jup|kal|kas|kes|koh|s e|s p|sel|sse|ui | pi| si|aru|eda|eva|fil|i v|ida|ing|lää|me |na |nda|nim|ole|ots|ris|s l|sia|t p| en| mu| ol| põ| su| vä| üh|a l|a p|aga|ale|aps|arv|e a|ela|ika|lle|loo|mal|pet|t k|tee|tis|vat|äne|õnn| es| fi| vi|a i|a o|aab|aap|ala|alt|ama|anu|e p|e t|eal|eli|haa|hin|iva|kon|ku |lik|lm |min|n t|odu|oon|psa|ri |si |stu|t e|t s|ti |ule|uur|vas|vee| ki| ni| nä| ra|aig|aka|all|atu|e e|eis|ers|i e|ii |iis|il |ima|its|kka|kuh|l k|lat|maj|ndu|ni |nii|oma|ool|rso|ru |rva|s t|sek|son|ste|t m|taj|tam|ude|uho|vai| ag| os| pa| re",
    "eu": "en |an |eta|ta | et|iza|n e|ko |ide| ba|a e|giz| es| gi|arr|bid|ren|rri|are|la |sku| be|asu|esk|sun|tas| iz|ean|eko|ela|ik |kub|n a|n i|tza|ubi|za |zan| er|a b|ask|era|n b|rre|ten|tze| as| ko|a a|a g|ald|ani|de |dee|ea |ek |kat|kon|n d|ont|uan| du| na|ata|egi|est|k e|nik|ntu|ntz|ska|tua| de| di| ez| he|a d|a k|ak |aki|ako|art|atu|azi|bat|ber|itz|kun|n h|o b|ria|rte|tat|une|zar| al| ar| ha|aku|atz|bai|dar|dea|del|een|ema|err|iak|iar|in |ina|kia|nar|naz|nea|o e|orr|ra |ste|tek|zak|zek|zio| da| em| hi| ho| ma| oi|agu|ate|aur|bes|din|dir|dut|ert|ez |ezi|har|her|hit|ia |ien|ika|io |ire|ite|k b|k g|kid|kor|lda|n o|nko|o a|oin|ori|rak|rea|rie|rik|rra|tan|tea|tu |una|und|unt|urr|ute|z e|zko| au| eg| gu| ir| ki| or|a h|a j|abe|agi|ai |ail|ait|ape|ari|dez|e e|ear|eek|erd|ere|eza|ezk|gir|git|hor|i e|ian|iek|ila|ink|int|ira|ita|itu|k n|kap|koa|kum|lan|lde|mai|man|men|n g|n u|na |nta|o h|oa |oro|pen|rdi|ri |rta|sta|tel|tet|tik|tue|tzi|ume|un |uzt|zea|zen|zia|zin| az| bi| bu| el| ga| jo| mu| ti| un| za| zi|a n|a o|a s|a t|a z|aba|adi|ake|ala|and|ar |aud|bak|bal|beg|beh|bul|dau|den|du |dui|e b|e d|e h|e o|eak|eet|eha|elk|enb|ete|eti|gab|gin|go |gus|gut|guz|hau|ibe|inb|ine|ioa|iru|iur|izi|izk|izo",
    "fa": "ان |ای |ه ا| اي| در|به | بر|در |ران| به|ی ا|از |ين |می | از|ده |ست |است| اس| که|که |اير|ند |اين| ها|يرا|ود | را|های| خو|ته |را |رای|رد |ن ب|کرد| و | کر|ات |برا|د ک|مان|ی د| ان|خوا|شور| با|ن ا| سا|تمی|ری |اتم|ا ا|واه| ات| عر|اق |ر م|راق|عرا|ی ب| تا| تو|ار |ر ا|ن م|ه ب|ور |يد |ی ک| ام| دا| کن|اهد|هد | آن| می| ني| گف|د ا|گفت| کش|ا ب|نی |ها |کشو| رو|ت ک|نيو|ه م|وی |ی ت| شو|ال |دار|مه |ن ک|ه د|يه | ما|امه|د ب|زار|ورا|گزا| پي|آن |انت|ت ا|فت |ه ن|ی خ|اما|بات|ما |ملل|نام|ير |ی م|ی ه| آم| ای| من|انس|اني|ت د|رده|ساز|ن د|نه |ورد| او| بي| سو| شد|اده|اند|با |ت ب|ر ب|ز ا|زما|سته|ن ر|ه س|وان|وز |ی ر|ی س| هس|ابا|ام |اور|تخا|خاب|خود|د د|دن |رها|روز|رگز|نتخ|ه ش|ه ه|هست|يت |يم | دو| دي| مو| نو| هم| کا|اد |اری|انی|بر |بود|ت ه|ح ه|حال|رش |عه |لی |وم |ژان| سل|آمر|اح |توس|داد|دام|ر د|ره |ريک|زی |سلا|شود|لاح|مري|نند|ه ع|يما|يکا|پيم|گر | آژ| ال| بو| مق| مل| وی|آژا|ازم|ازی|بار|برن|ر آ|ز س|سعه|شته|مات|ن آ|ن پ|نس |ه گ|وسع|يان|يوم|کا |کام|کند| خا| سر|آور|ارد|اقد|ايم|ايی|برگ|ت ع|تن |خت |د و|ر خ|رک |زير|فته|قدا|ل ت|مين|ن گ|ه آ|ه خ|ه ک|ورک|ويو|يور|يوي|يی |ک ت|ی ش| اق| حا| حق| دس| شک| عم| يک|ا ت|ا د|ارج|بين|ت م|ت و|تاي|دست|ر ح|ر س|رنا|ز ب|شکا|لل |م ک|مز |ندا|نوا|و ا|وره|ون |وند|يمز| آو| اع| فر| مت| نه| هر| وز| گز",
    "fi": "en |in |an |on |ist|ta |ja |n t|sa |sta|aan|n p| on|ssa|tta|tä | ka| pa|si | ja|n k|lla|än |een|n v|ksi|ett|nen|taa|ttä| va|ill|itt| jo| ko|n s| tu|ia | su|a p|aa |la |lle|n m|le |tte|na | ta| ve|at | vi|utt| sa|ise|sen| ku| nä| pä|ste| ol|a t|ais|maa|ti |a o|oit|pää| pi|a v|ala|ine|isi|tel|tti| si|a k|all|iin|kin|stä|uom|vii| ma| se|enä| mu|a s|est|iss|llä|lok|lä |n j|n o|toi|ven|ytt| li|ain|et |ina|n a|n n|oll|plo|ten|ust|äll|ään| to|den|men|oki|suo|sä |tää|uks|vat| al| ke| te|a e|lii|tai|tei|äis|ää | pl|ell|i t|ide|ikk|ki |nta|ova|yst|yt |ä p|äyt| ha| pe| tä|a n|aik|i p|i v|nyt|näy|pal|tee|un | me|a m|ess|kau|pai|stu|ut |voi| et|a h|eis|hte|i o|iik|ita|jou|mis|nin|nut|sia|ssä|van| ty| yh|aks|ime|loi|me |n e|n h|n l|oin|ome|ott|ouk|sit|sti|tet|tie|ukk|ä k| ra| ti|aja|asi|ent|iga|iig|ite|jan|kaa|kse|laa|lan|li |näj|ole|tii|usi|äjä| ov|a a|ant|ava|ei |eri|kan|kku|lai|lis|läi|mat|ois|pel|sil|sty|taj|tav|ttu|työ|yös|ä o| ai| pu|a j|a l|aal|arv|ass|ien|imi|imm|itä|ka |kes|kue|lee|lin|llo|one|ri |t o|t p|tu |val|vuo| ei| he| hy| my| vo|ali|alo|ano|ast|att|auk|eli|ely|hti|ika|ken|kki|lys|min|myö|oht|oma|tus|umi|yks|ät |ääl|ös | ar| eu| hu| na|aat|alk|alu|ans|arj|enn|han|kuu|n y|set|sim",
    "fr": "es | de|de | le|ent|le |nt |la |s d| la|ion|on |re | pa|e l|e d| l'|e p| co| pr|tio|ns | en|ne |que|r l|les|ur |en |ati|ue | po| d'|par| a |et |it | qu|men|ons|te | et|t d| re|des| un|ie |s l| su|pou| au| à |con|er | no|ait|e c|se |té |du | du| dé|ce |e e|is |n d|s a| so|e r|e s|our|res|ssi|eur| se|eme|est|us |sur|ant|iqu|s p|une|uss|l'a|pro|ter|tre|end|rs | ce|e a|t p|un | ma| ru| ré|ous|ris|rus|sse|ans|ar |com|e m|ire|nce|nte|t l| av| mo| te|il |me |ont|ten|a p|dan|pas|qui|s e|s s| in|ist|lle|nou|pré|'un|air|d'a|ir |n e|rop|ts | da|a s|as |au |den|mai|mis|ori|out|rme|sio|tte|ux |a d|ien|n a|ntr|omm|ort|ouv|s c|son|tes|ver|ère| il| m | sa| ve|a r|ais|ava|di |n p|sti|ven| mi|ain|enc|for|ité|lar|oir|rem|ren|rro|rés|sie|t a|tur| pe| to|d'u|ell|err|ers|ide|ine|iss|mes|por|ran|sit|st |t r|uti|vai|é l|ési| di| n'| ét|a c|ass|e t|in |nde|pre|rat|s m|ste|tai|tch|ui |uro|ès | es| fo| tr|'ad|app|aux|e à|ett|iti|lit|nal|opé|r d|ra |rai|ror|s r|tat|uté|à l| af|anc|ara|art|bre|ché|dre|e f|ens|lem|n r|n t|ndr|nne|onn|pos|s t|tiq|ure| tu|ale|and|ave|cla|cou|e n|emb|ins|jou|mme|rie|rès|sem|str|t i|ues|uni|uve|é d|ée | ch| do| eu| fa| lo| ne| ra|arl|att|ec |ica|l a|l'o|l'é|mmi|nta|orm|ou |r u|rle",
    "ha": " da|da |in |an |ya | wa| ya|na |ar |a d| ma|wa |a a|a k|a s| ta|wan| a | ba| ka|ta |a y|n d| ha| na| su| sa|kin|sa |ata| ko|a t|su | ga|ai | sh|a m|uwa|iya|ma |a w|asa|yan|ka |ani|shi|a b|a h|a c|ama|ba |nan|n a| mu|ana| yi|a g| za|i d| ku|aka|yi |n k|ann|ke |tar| ci|iki|n s|ko | ra|ki |ne |a z|mat|hak|nin|e d|nna|uma|nda|a n|ada|cik|ni |rin|una|ara|kum|akk| ce| du|man|n y|nci|sar|aki|awa|ci |kan|kar|ari|n m|and|hi |n t|ga |owa|ash|kam|dan|ewa|nsa|ali|ami| ab| do|anc|n r|aya|i n|sun|uka| al| ne|a'a|cew|cin|mas|tak|un |aba|kow|a r|ra | ja| ƙa|en |r d|sam|tsa| ru|ce |i a|abi|ida|mut|n g|n j|san|a ƙ|har|on |i m|suk| ak| ji|yar|'ya|kwa|min| 'y|ane|ban|ins|ruw|i k|n h| ad|ake|n w|sha|utu| ƴa|bay|tan|ƴan|bin|duk|e m|n n|oka|yin|ɗan| fa|a i|kki|re |za |ala|asu|han|i y|mar|ran|ƙas|add|ars|gab|ira|mma|u d| ts|abb|abu|aga|gar|n b| ɗa|aci|aik|am |dun|e s|i b|i w|kas|kok|wam| am|amf|bba|din|fan|gwa|i s|wat|ano|are|dai|iri|ma'| la|all|dam|ika|mi |she|tum|uni| an| ai| ke| ki|dag|mai|mfa|no |nsu|o d|sak|um | bi| gw| kw|jam|yya|a j|fa |uta| hu|'a |ans|aɗa|dda|hin|niy|r s|bat|dar|gan|i t|nta|oki|omi|sal|a l|kac|lla|wad|war|amm|dom|r m|ras|sai| lo|ats|hal|kat|li |lok|n c|nar|tin|afa|bub|i g|isa|mak",
    "haw": " ka|na | o |ka | ma| a | la|a i|a m| i |la |ana|ai |ia |a o|a k|a h|o k| ke|a a|i k| ho| ia|ua | na| me|e k|e a|au |ke |ma |mai|aku| ak|ahi| ha| ko| e |a l| no|me |ku |aka|kan|no |i a|ho |ou | ai|i o|a p|o l|o a|ama|a n| an|i m|han|i i|iho|kou|ne | ih|o i|iki|ona|hoo|le |e h| he|ina| wa|ea |ako|u i|kah|oe |i l|u a| pa|hoi|e i|era|ko |u m|kua|mak|oi |kai|i n|a e|hin|ane| ol|i h|mea|wah|lak|e m|o n|u l|ika|ki |a w|mal|hi |e n|u o|hik| ku|e l|ele|ra |ber|ine|abe|ain|ala|lo | po|kon| ab|ole|he |pau|mah|va |ela|kau|nak| oe|kei|oia| ie|ram| oi|oa |eho|hov|ieh|ova| ua|una|ara|o s|awa|o o|nau|u n|wa |wai|hel| ae| al|ae |ta |aik| hi|ale|ila|lel|ali|eik|olo|onu| lo|aua|e o|ola|hon|mam|nan| au|aha|lau|nua|oho|oma| ao|ii |alu|ima|mau|ike|apa|elo|lii|poe|aia|noa| in|o m|oka|'u |aho|ei |eka|ha |lu |nei|hol|ino|o e|ema|iwa|olu|ada|naa|pa |u k|ewa|hua|lam|lua|o h|ook|u h| li|ahu|amu|ui | il| mo| se|eia|law| hu| ik|ail|e p|li |lun|uli|io |kik|noh|u e| sa|aaw|awe|ena|hal|kol|lan| le| ne|a'u|ilo|kap|oko|sa | pe|hop|loa|ope|pe | ad| pu|ahe|aol|ia'|lai|loh|na'|oom|aau|eri|kul|we |ake|kek|laa|ri |iku|kak|lim|nah|ner|nui|ono|a u|dam|kum|lok|mua|uma|wal|wi |'i |a'i|aan|alo|eta|mu |ohe|u p|ula|uwa| nu|amo",
    "hi": "ें | है|में| मे|ने |की |के |है | के| की| को|ों |को |ा ह| का|से |ा क|े क|ं क|या | कि| से|का |ी क| ने| और|और |ना |कि |भी |ी स| जा| पर|ार | कर|ी ह| हो|ही |िया| इस| रह|र क|ुना|ता |ान |े स| भी| रा|े ह| चु| पा|पर |चुन|नाव| कह|प्र| भा|राज|हैं|ा स|ै क|ैं |नी |ल क|ीं |़ी |था |री |ाव |े ब| प्|क्ष|पा |ले | दे|ला |हा |ाजप| था| नह|इस |कर |जपा|नही|भाज|यों|र स|हीं| अम| बा| मा| वि|रीक|िए |े प|्या| ही|ं म|कार|ा ज|े ल| ता| दि| सा| हम|ा न|ा म|ाक़|्ता| एक| सं| स्|अमर|क़ी|ताज|मरी|स्थ|ा थ|ार्| हु|इरा|एक |न क|र म|राक|ी ज|ी न| इर| उन| पह|कहा|ते |े अ| तो| सु|ति |ती |तो |मिल|िक |ियो|्रे| अप| फ़| लि| लो| सम|म क|र्ट|हो |ा च|ाई |ाने|िन |्य | उस| क़| सक| सै|ं प|ं ह|गी |त क|मान|र न|ष्ट|स क|स्त|ाँ |ी ब|ी म|्री| दो| मि| मु| ले| शा|ं स|ज़ा|त्र|थी |लिए|सी |़ा |़ार|ांग|े द|े म|्व | ना| बन|ंग्|कां|गा |ग्र|जा |ज्य|दी |न म|पार|भा |रही|रे |रेस|ली |सभा|ा र|ाल |ी अ|ीकी|े त|ेश | अं| तक| या|ई ह|करन|तक |देश|वर्|ाया|ी भ|ेस |्ष | गय| जि| थी| बड| यह| वा|ंतर|अंत|क़ |गया|टी |निक|न्ह|पहल|बड़|मार|र प|रने|ाज़|ि इ|ी र|े ज|े व|्ट |्टी| अब| लग| वर| सी|ं भ|उन्|क क|किय|देख|पूर|फ़्|यह |यान|रिक|रिय|र्ड|लेक|सकत|हों|होग|ा अ|ा द|ा प|ाद |ारा|ित |ी त|ी प|ो क|ो द| ते| नि| सर| हा|ं द|अपन|जान|त म|थित|पनी|महल|र ह|लोग|व क|हना|हल |हाँ|ाज्|ाना|िक्|िस्",
    "hr": "je | na| pr| po|na | je| za|ije|ne | i |ti |da | ko| ne|li | bi| da| u |ma |mo |a n|ih |za |a s|ko |i s|a p|koj|pro|ju |se | go|ost|to |va | do| to|e n|i p| od| ra|no |ako|ka |ni | ka| se| mo| st|i n|ima|ja |pri|vat|sta| su|ati|e p|ta |tsk|e i|nij| tr|cij|jen|nos|o s| iz|om |tro|ili|iti|pos| al|a i|a o|e s|ija|ini|pre|str|la |og |ovo| sv|ekt|nje|o p|odi|rva| ni|ali|min|rij|a t|a z|ats|iva|o t|od |oje|ra | hr|a m|a u|hrv|im |ke |o i|ovi|red|riv|te |bi |e o|god|i d|lek|umi|zvo|din|e u|ene|jed|ji |lje|nog|su | a | el| mi| o |a d|alu|ele|i u|izv|ktr|lum|o d|ori|rad|sto|a k|anj|ava|e k|men|nic|o j|oj |ove|ski|tvr|una|vor| di| no| s | ta| tv|i i|i o|kak|roš|sko|vod| sa| će|a b|adi|amo|eni|gov|iju|ku |o n|ora|rav|ruj|smo|tav|tru|u p|ve | in| pl|aci|bit|de |diš|ema|i m|ika|išt|jer|ki |mog|nik|nov|nu |oji|oli|pla|pod|st |sti|tra|tre|vo | sm| št|dan|e z|i t|io |ist|kon|lo |stv|u s|uje|ust|će |ći |što| dr| im| li|ada|aft|ani|ao |ars|ata|e t|emo|i k|ine|jem|kov|lik|lji|mje|naf|ner|nih|nja|ogo|oiz|ome|pot|ran|ri |roi|rtk|ska|ter|u i|u o|vi |vrt| me| ug|ak |ama|drž|e e|e g|e m|em |eme|enj|ent|er |ere|erg|eur|go |i b|i z|jet|ksi|o u|oda|ona|pra|reb|rem|rop|tri|žav| ci| eu| re| te| uv| ve|aju|an ",
    "hu": " a | az| sz|az | me|en | el| ho|ek |gy |tt |ett|sze| fe|és | ki|tet| be|et |ter| kö| és|hog|meg|ogy|szt|te |t a|zet|a m|nek|nt |ség|szá|ak | va|an |eze|ra |ta | mi|int|köz| is|esz|fel|min|nak|ors|zer| te|a a|a k|is | cs|ele|er |men|si |tek|ti | ne|csa|ent|z e|a t|ala|ere|es |lom|lte|mon|ond|rsz|sza|tte|zág|ány| fo| ma|ai |ben|el |ene|ik |jel|tás|áll| ha| le| ál|agy|alá|isz|y a|zte|ás | al|e a|egy|ely|for|lat|lt |n a|oga|on |re |st |ság|t m|án |ét |ült| je|gi |k a|kül|lam|len|lás|más|s k|vez|áso|özö| ta|a s|a v|asz|atá|ető|kez|let|mag|nem|szé|z m|át |éte|ölt| de| gy| ké| mo| vá| ér|a b|a f|ami|at |ato|att|bef|dta|gya|hat|i s|las|ndt|rt |szo|t k|tár|tés|van|ásá|ól | bé| eg| or| pá| pé| ve|ban|eke|ekü|elő|erv|ete|fog|i a|kis|lád|nte|nye|nyi|ok |omá|os |rán|rás|sal|t e|vál|yar|ágo|ála|ége|ény|ött| tá|adó|elh|fej|het|hoz|ill|jár|kés|llo|mi |ny |ont|ren|res|rin|s a|s e|ssz|zt | ez| ka| ke| ko| re|a h|a n|den|dó |efo|gad|gat|gye|hel|k e|ket|les|mán|nde|nis|ozz|t b|t i|t é|tat|tos|val|z o|zak|ád |ály|ára|ési|ész| ak| am| es| há| ny| tö|aka|art|ató|azt|bbe|ber|ció|cso|em |eti|eté|gal|i t|ini|ist|ja |ker|ki |kor|koz|l é|ljá|lye|n v|ni |pál|ror|ról|rül|s c|s p|s s|s v|sok|t j|t t|tar|tel|vat",
    "id": "an | me|kan|ang|ng | pe|men| di| ke| da| se|eng| be|nga|nya| te|ah |ber|aka| ya|dan|di |yan|n p|per|a m|ita| pa|da |ata|ada|ya |ta | in|ala|eri|ia |a d|n k|am |ga |at |era|n d|ter| ka|a p|ari|emb|n m|ri | ba|aan|ak |ra | it|ara|ela|ni |ali|ran|ar |eru|lah|a b|asi|awa|eba|gan|n b| ha|ini|mer| la| mi|and|ena|wan| sa|aha|lam|n i|nda| wa|a i|dua|g m|mi |n a|rus|tel|yak| an|dal|h d|i s|ing|min|ngg|tak|ami|beb|den|gat|ian|ih |pad|rga|san|ua | de|a t|arg|dar|elu|har|i k|i m|i p|ika|in |iny|itu|mba|n t|ntu|pan|pen|sah|tan|tu |a k|ban|edu|eka|g d|ka |ker|nde|nta|ora|usa| du| ma|a s|ai |ant|bas|end|i d|ira|kam|lan|n s|uli|al |apa|ere|ert|lia|mem|rka|si |tal|ung| ak|a a|a w|ani|ask|ent|gar|haa|i i|isa|ked|mbe|ska|tor|uan|uk |uka| ad| to|asa|aya|bag|dia|dun|erj|mas|na |rek|rit|sih|us | bi|a h|ama|dib|ers|g s|han|ik |kem|ma |n l|nit|r b|rja|sa | ju| or| si| ti|a y|aga|any|as |cul|eme|emu|eny|epa|erb|erl|gi |h m|i a|kel|li |mel|nia|opa|rta|sia|tah|ula|un |unt| at| bu| pu| ta|agi|alu|amb|bah|bis|er |i t|ibe|ir |ja |k m|kar|lai|lal|lu |mpa|ngk|nja|or |pa |pas|pem|rak|rik|seb|tam|tem|top|tuk|uni|war| al| ga| ge| ir| ja| mu| na| pr| su| un|ad |adi|akt|ann|apo|bel|bul|der|ega|eke|ema|emp|ene|enj|esa",
    "is": "að |um | að|ir |ið |ur | ve| í |na | á | se| er| og|ar |og |ver| mi|inn|nn | fy|er |fyr| ek| en| ha| he|ekk| st|ki |st |ði | ba| me| vi|ig |rir|yri| um|g f|leg|lei|ns |ð s| ei| þa|in |kki|r h|r s|egi|ein|ga |ing|ra |sta| va| þe|ann|en |mil|sem|tjó|arð|di |eit|haf|ill|ins|ist|llj|ndi|r a|r e|seg|un |var| bi| el| fo| ge| yf|and|aug|bau|big|ega|eld|erð|fir|foo|gin|itt|n s|ngi|num|od |ood|sin|ta |tt |við|yfi|ð e|ð f| hr| sé| þv|a e|a á|em |gi |i f|jar|jór|lja|m e|r á|rei|rst|rða|rði|rðu|stj|und|veg|ví |ð v|það|því| fj| ko| sl|eik|end|ert|ess|fjá|fur|gir|hús|jár|n e|ri |tar|ð þ|ðar|ður|þes| br| hú| kr| le| up|a s|egg|i s|irt|ja |kið|len|með|mik|n b|nar|nir|nun|r f|r v|rið|rt |sti|t v|ti |una|upp|ða |óna| al| fr| gr|a v|all|an |da |eið|eð |fa |fra|g e|ger|gið|gt |han|hef|hel|her|hra|i a|i e|i v|i þ|iki|jón|jör|ka |kró|lík|m h|n a|nga|r l|ram|ru |ráð|rón|svo|vin|í b|í h|ð h|ð k|ð m|örð| af| fa| lí| rá| sk| sv| te|a b|a f|a h|a k|a u|afi|agn|arn|ast|ber|efu|enn|erb|erg|fi |g a|gar|iðs|ker|kke|lan|ljó|llt|ma |mið|n v|n í|nan|nda|ndu|nið|nna|nnu|nu |r o|rbe|rgi|slö|sé |t a|t h|til|tin|ugu|vil|ygg|á s|ð a|ð b|órn|ögn|öku| at| fi| fé| ka| ma| no| sa| si| ti| ák|a m|a t|a í|a þ|afa|afs|ald|arf",
    "it": " di|to |la | de|di |no | co|re |ion|e d| e |le |del|ne |ti |ell| la| un|ni |i d|per| pe|ent| in|one|he |ta |zio|che|o d|a d|na |ato|e s| so|i s|lla|a p|li |te | al| ch|er | pa| si|con|sta| pr|a c| se|el |ia |si |e p| da|e i|i p|ont|ano|i c|all|azi|nte|on |nti|o s| ri|i a|o a|un | an|are|ari|e a|i e|ita|men|ri | ca| il| no| po|a s|ant|il |in |a l|ati|cia|e c|ro |ann|est|gli|tà | qu|e l|nta| a |com|o c|ra | le| ne|ali|ere|ist| ma| è |io |lle|me |era|ica|ost|pro|tar|una| pi|da |tat| mi|att|ca |mo |non|par|sti| fa| i | re| su|ess|ini|nto|o l|ssi|tto|a e|ame|col|ei |ma |o i|za | st|a a|ale|anc|ani|i m|ian|o p|oni|sio|tan|tti| lo|i r|oci|oli|ona|ono|tra| l |a r|eri|ett|lo |nza|que|str|ter|tta| ba| li| te|ass|e f|enz|for|nno|olo|ori|res|tor| ci| vo|a i|al |chi|e n|lia|pre|ria|uni|ver| sp|imo|l a|l c|ran|sen|soc|tic| fi| mo|a n|ce |dei|ggi|gio|iti|l s|lit|ll |mon|ola|pac|sim|tit|utt|vol| ar| fo| ha| sa|acc|e r|ire|man|ntr|rat|sco|tro|tut|va | do| gi| me| sc| tu| ve| vi|a m|ber|can|cit|i l|ier|ità|lli|min|n p|nat|nda|o e|o f|o u|ore|oro|ort|sto|ten|tiv|van|art|cco|ci |cos|dal|e v|i i|ila|ino|l p|n c|nit|ole|ome|po |rio|sa | ce| es| tr|a b|and|ata|der|ens|ers|gi |ial|ina|itt|izi|lan|lor|mil",
    "kk": "ан |ен |ың | қа| ба|ай |нда|ын | са| ал|ді |ары|ды |ып | мұ| бі|асы|да |най| жа|мұн|ста|ған|н б|ұна| бо|ның|ін |лар|сын| де|аға|тан| кө|бір|ер |мен|аза|ынд|ыны| ме|анд|ері|бол|дың|қаз|аты|сы |тын|ғы | ке|ар |зақ|ық |ала|алы|аны|ара|ағы|ген|тар|тер|тыр|айд|ард|де |ға | қо|бар|ің |қан| бе| қы|ақс|гер|дан|дар|лық|лға|ына|ір |ірі|ғас| та|а б|гі |еді|еле|йды|н к|н т|ола|рын|іп |қст|қта|ң б| ай| ол| со|айт|дағ|иге|лер|лып|н а|ік |ақт|бағ|кен|н қ|ны |рге|рға|ыр | ар|алғ|аса|бас|бер|ге |еті|на |нде|не |ниг|рды|ры |сай| ау| кү| ни| от| өз|ауд|еп |иял|лты|н ж|н о|осы|оты|рып|рі |тке|ты |ы б|ы ж|ылы|ысы|і с|қар| бұ| да| же| тұ| құ|ады|айл|ап |ата|ені|йла|н м|н с|нды|нді|р м|тай|тін|ы т|ыс |інд| би|а ж|ауы|деп|дің|еке|ери|йын|кел|лды|ма |нан|оны|п ж|п о|р б|рия|рла|уда|шыл|ы а|ықт|і а|і б|із |ілі|ң қ| ас| ек| жо| мә| ос| ре| се|алд|дал|дег|дей|е б|ет |жас|й б|лау|лда|мет|нын|сар|сі |ті |ыры|ыта|ісі|ң а|өте| ат| ел| жү| ма| то| шы|а а|алт|ама|арл|аст|бұл|дай|дық|ек |ель|есі|зді|көт|лем|ль |н е|п а|р а|рес|са |та |тте|тұр|шы |ы д|ы қ|ыз |қыт| ко| не| ой| ор| сұ| тү|аль|аре|атт|дір|ев |егі|еда|екі|елд|ерг|ерд|ияд|кер|кет|лыс|ліс|мед|мпи|н д|ні |нін|п т|пек|рел|рта|ріл|рін|сен|тал|шіл|ы к|ы м|ыст",
    "ky": "ын |ан | жа|ен |да | та|ар |ин | ка|ары| ал| ба| би|лар| бо| кы|ала|н к| са|нда|ган|тар| де|анд|н б| ке|ард|мен|н т|ара|нын| да| ме|кыр| че|н а|ры | ко|ген|дар|кен|кта|уу |ене|ери| ша|алы|ат |на | кө| эм|аты|дан|деп|дын|еп |нен|рын| бе|кан|луу|ргы|тан|шай|ырг|үн | ар| ма|агы|акт|аны|гы |гыз|ды |рда|ай |бир|бол|ер |н с|нды|ун |ча |ынд|а к|ага|айл|ана|ап |га |лге|нча|п к|рды|туу|ыны| ан| өз|ама|ата|дин|йт |лга|лоо|оо |ри |тин|ыз |ып |өрү| па| эк|а б|алг|асы|ашт|биз|кел|кте|тал| не| су|акы|ент|инд|ир |кал|н д|нде|ого|онд|оюн|р б|р м|ран|сал|ста|сы |ура|ыгы| аш| ми| сы| ту|ал |арт|бор|елг|ени|ет |жат|йло|кар|н м|огу|п а|п ж|р э|сын|ык |юнч| бу| ур|а а|ак |алд|алу|бар|бер|бою|ге |дон|еги|ект|ефт|из |кат|лды|н ч|н э|н ө|ндо|неф|он |сат|тор|ты |уда|ул |ула|ууд|ы б|ы ж|ы к|ыл |ына|эке|ясы| ат| до| жы| со| чы|аас|айт|аст|баа|баш|гар|гын|дө |е б|ек |жыл|и б|ик |ияс|кыз|лда|лык|мда|н ж|нди|ни |нин|орд|рдо|сто|та |тер|тти|тур|тын|уп |ушу|фти|ыкт|үп |өн | ай| бү| ич| иш| мо| пр| ре| өк| өт|а д|а у|а э|айм|амд|атт|бек|бул|гол|дег|еге|ейт|еле|енд|жак|и к|ини|ири|йма|кто|лик|мак|мес|н у|н ш|нтт|ол |оло|пар|рак|рүү|сыр|ти |тик|тта|төр|у ж|у с|шка|ы м|ызы|ылд|эме|үрү|өлү|өтө| же| тү| эл| өн|а ж|ады",
    "la": "um |us |ut |et |is | et| in| qu|tur| pr|est|tio| au|am |em |aut| di|ent|in |dic|t e| es|ur |ati|ion|st | ut|ae |qua| de|nt | su| si|itu|unt|rum|ia |es |ter| re|nti|rae|s e|qui|io |pro|it |per|ita|one|ici|ius| co|t d|bus|pra|m e| no|edi|tia|ue |ibu| se| ad|er | fi|ili|que|t i|de |oru| te|ali| pe|aed|cit|m d|t s|tat|tem|tis|t p|sti|te |cum|ere|ium| ex|rat|ta |con|cti|oni|ra |s i| cu| sa|eni|nis|nte|eri|omi|re |s a|min|os |ti |uer| ma| ue|m s|nem|t m| mo| po| ui|gen|ict|m i|ris|s s|t a|uae| do|m a|t c| ge|as |e i|e p|ne | ca|ine|quo|s p| al|e e|ntu|ro |tri|tus|uit|atu|ini|iqu|m p|ost|res|ura| ac| fu|a e|ant|nes|nim|sun|tra|e a|s d| pa| uo|ecu| om| tu|ad |cut|omn|s q| ei|ex |icu|tor|uid| ip| me|e s|era|eru|iam|ide|ips| iu|a s|do |e d|eiu|ica|im |m c|m u|tiu| ho|cat|ist|nat|on |pti|reg|rit|s t|sic|spe| en| sp|dis|eli|liq|lis|men|mus|num|pos|sio| an| gr|abi|acc|ect|ri |uan| le|ecc|ete|gra|non|se |uen|uis| fa| tr|ate|e c|fil|na |ni |pul|s f|ui |at |cce|dam|i e|ina|leg|nos|ori|pec|rop|sta|uia|ene|iue|iui|siu|t t|t u|tib|tit| da| ne|a d|and|ege|equ|hom|imu|lor|m m|mni|ndo|ner|o e|r e|sit|tum|utu|a p|bis|bit|cer|cta|dom|fut|i s|ign|int|mod|ndu|nit|rib|rti|tas|und| ab|err|ers|ite|iti|m t|o p",
    "lt": "as | pa| ka|ai |us |os |is | ne| ir|ir |ti | pr|aus|ini|s p|pas|ių | ta| vi|iau| ko| su|kai|o p|usi| sa|vo |tai|ali|tų |io |jo |s k|sta|iai| bu| nu|ius|mo | po|ien|s s|tas| me|uvo|kad| iš| la|to |ais|ie |kur|uri| ku|ijo|čia|au |met|je | va|ad | ap|and| gr| ti|kal|asi|i p|iči|s i|s v|ink|o n|ės |buv|s a| ga|aip|avi|mas|pri|tik| re|etu|jos| da|ent|oli|par|ant|ara|tar|ama|gal|imo|išk|o s| at| be| į |min|tin| tu|s n| jo|dar|ip |rei| te|dži|kas|nin|tei|vie| li| se|cij|gar|lai|art|lau|ras|no |o k|tą | ar|ėjo|vič|iga|pra|vis| na|men|oki|raš|s t|iet|ika|int|kom|tam|aug|avo|rie|s b| st|eim|ko |nus|pol|ria|sau|api|me |ne |sik| ši|i n|ia |ici|oja|sak|sti|ui |ame|lie|o t|pie|čiu| di| pe|gri|ios|lia|lin|s d|s g|ta |uot| ja| už|aut|i s|ino|mą |oje|rav|dėl|nti|o a|toj|ėl | to| vy|ar |ina|lic|o v|sei|su | mi| pi|din|iš |lan|si |tus| ba|asa|ata|kla|omi|tat| an| ji|als|ena|jų |nuo|per|rig|s m|val|yta|čio| ra|i k|lik|net|nė |tis|tuo|yti|ęs |ų s|ada|ari|do |eik|eis|ist|lst|ma |nes|sav|sio|tau| ki|aik|aud|ies|ori|s r|ska| ge|ast|eig|et |iam|isa|mis|nam|ome|žia|aba|aul|ikr|ką |nta|ra |tur| ma|die|ei |i t|nas|rin|sto|tie|tuv|vos|ų p| dė|are|ats|enė|ili|ima|kar|ms |nia|r p|rod|s l| o |e p|es |ide|ik |ja ",
    "lv": "as | la| pa| ne|es | un|un | ka| va|ar |s p| ar| vi|is |ai | no|ja |ija|iem|em |tu |tie|vie|lat|aks|ien|kst|ies|s a|rak|atv|tvi| ja| pi|ka | ir|ir |ta | sa|ts | kā|ās | ti|ot |s n| ie| ta|arī|par|pie| pr|kā | at| ra|am |inā|tā | iz|jas|lai| na|aut|ieš|s s| ap| ko| st|iek|iet|jau|us |rī |tik|ība|na | ga|cij|s i| uz|jum|s v|ms |var| ku| ma|jā |sta|s u| tā|die|kai|kas|ska| ci| da|kur|lie|tas|a p|est|stā|šan|nes|nie|s d|s m|val| di| es| re|no |to |umu|vai|ši | vē|kum|nu |rie|s t|ām |ad |et |mu |s l| be|aud|tur|vij|viņ|āju|bas|gad|i n|ika|os |a v|not|oti|sts|aik|u a|ā a|āk | to|ied|stu|ti |u p|vēl|āci| šo|gi |ko |pro|s r|tāj|u s|u v|vis|aun|ks |str|zin|a a|adī|da |dar|ena|ici|kra|nas|stī|šu | mē|a n|eci|i s|ie |iņa|ju |las|r t|ums|šie|bu |cit|i a|ina|ma |pus|ra | au| se| sl|a s|ais|eši|iec|iku|pār|s b|s k|sot|ādā| in| li| tr|ana|eso|ikr|man|ne |u k| tu|an |av |bet|būt|im |isk|līd|nav|ras|ri |s g|sti|īdz| ai|arb|cin|das|ent|gal|i p|lik|mā |nek|pat|rēt|si |tra|uši|vei| br| pu| sk|als|ama|edz|eka|ešu|ieg|jis|kam|lst|nāk|oli|pre|pēc|rot|tās|usi|ēl |ēs | bi| de| me| pā|a i|aid|ajā|ikt|kat|lic|lod|mi |ni |pri|rād|rīg|sim|trā|u l|uto|uz |ēc |ītā| ce| jā| sv|a t|aga|aiz|atu|ba |cie|du |dzi|dzī",
    "mk": "на | на|та |ата|ија| пр|то |ја | за|а н| и |а с|те |ите| ко|от | де| по|а д|во |за | во| од| се| не|се | до|а в|ка |ање|а п|о п|ува|циј|а о|ици|ето|о н|ани|ни | вл|дек|ека|њет|ќе | е |а з|а и|ат |вла|го |е н|од |пре| го| да| ма| ре| ќе|али|и д|и н|иот|нат|ово| па| ра| со|ове|пра|што|ње |а е|да |дат|дон|е в|е д|е з|е с|кон|нит|но |они|ото|пар|при|ста|т н| шт|а к|аци|ва |вањ|е п|ени|ла |лад|мак|нес|нос|про|рен|јат| ин| ме| то|а г|а м|а р|аке|ако|вор|гов|едо|ена|и и|ира|кед|не |ниц|ниј|ост|ра |рат|ред|ска|тен| ка| сп| ја|а т|аде|арт|е г|е и|кат|лас|нио|о с|ри | ба| би|ава|ате|вни|д н|ден|дов|држ|дув|е о|ен |ере|ери|и п|и с|ина|кој|нци|о м|о о|одн|пор|ски|спо|ств|сти|тво|ти | об| ов|а б|алн|ара|бар|е к|ед |ент|еѓу|и о|ии |меѓ|о д|оја|пот|раз|раш|спр|сто|т д|ци | бе| гр| др| из| ст|аа |бид|вед|гла|еко|енд|есе|етс|зац|и т|иза|инс|ист|ки |ков|кол|ку |лиц|о з|о и|ова|олк|оре|ори|под|рањ|реф|ржа|ров|рти|со |тор|фер|цен|цит| а | вр| гл| дп| мо| ни| но| оп| от|а ќ|або|ада|аса|аша|ба |бот|ваа|ват|вот|ги |гра|де |дин|дум|евр|еду|ено|ера|ес |ење|же |зак|и в|ила|иту|коа|кои|лан|лку|лож|мот|нду|нст|о в|оа |оал|обр|ов |ови|овн|ои |ор |орм|ој |рет|сед|ст |тер|тиј|тоа|фор|ции|ѓу | ал| ве| вм| ги| ду",
    "mn": "ын | ба|йн |бай|ийн|уул| ул|улс|ан | ха|ний|н х|гаа|сын|ий |лсы| бо|й б|эн |ах |бол|ол |н б|оло| хэ|онг|гол|гуу|нго|ыг |жил| мо|лаг|лла|мон| тє| ху|айд|ны |он |сан|хий| аж| ор|л у|н т|улг|айг|длы|йг | за|дэс|н а|ндэ|ула|ээ |ага|ийг|vй |аа |й а|лын|н з| аю| зє|аар|ад |ар |гvй|зєв|ажи|ал |аюу|г х|лгv|лж |сни|эсн|юул|йдл|лыг|нхи|ууд|хам| нэ| са|гий|лах|лєл|рєн|єгч| та|илл|лий|лэх|рий|эх | ер| эр|влє|ерє|ийл|лон|лєг|євл|єнх| хо|ари|их |хан|эр |єн |vvл|ж б|тэй|х х|эрх| vн| нь|vнд|алт|йлє|нь |тєр| га| су|аан|даа|илц|йгу|л а|лаа|н н|руу|эй | то|н с|рил|єри|ааг|гч |лээ|н о|рэг|суу|эрэ|їїл| yн| бу| дэ| ол| ту| ши|yнд|аши|г т|иг |йл |хар|шин|эг |єр | их| хє| хї|ам |анг|ин |йга|лса|н v|н е|нал|нд |хуу|цаа|эд |ээр|єл |vйл|ада|айн|ала|амт|гах|д х|дал|зар|л б|лан|н д|сэн|улл|х б|хэр| бv| да| зо|vрэ|аад|гээ|лэн|н и|н э|нга|нэ |тал|тын|хур|эл | на| ни| он|vлэ|аг |аж |ай |ата|бар|г б|гад|гїй|й х|лт |н м|на |оро|уль|чин|эж |энэ|ээд|їй |їлэ| би| тэ| эн|аны|дий|дээ|лал|лга|лд |лог|ль |н у|н ї|р б|рал|сон|тай|удл|элт|эрг|єлє| vй| в | гэ| хv|ара|бvр|д н|д о|л х|лс |лты|н г|нэг|огт|олы|оёр|р т|рээ|тав|тог|уур|хоё|хэл|хээ|элэ|ёр | ав| ас| аш| ду| со| чи| эв| єр|аал|алд|амж|анд|асу|вэр|г у|двэ|жvv|лца|лэл",
    "no": "er |en |et | de|det| i |for|il | fo| me|ing|om | ha| og|ter| er| ti| st|og |til|ne | vi|re | en| se|te |or |de |kke|ke |ar |ng |r s|ene| so|e s|der|an |som|ste|at |ed |r i| av| in|men| at| ko| på|har| si|ere|på |nde|and|els|ett|tte|lig|t s|den|t i|ikk|med|n s|rt |ser|ska|t e|ker|sen|av |ler|r a|ten|e f|r e|r t|ede|ig | re|han|lle|ner| bl| fr|le | ve|e t|lan|mme|nge| be| ik| om| å |ell|sel|sta|ver| et| sk|nte|one|ore|r d|ske| an| la|del|gen|nin|r f|r v|se | po|ir |jon|mer|nen|omm|sjo| fl| sa|ern|kom|r m|r o|ren|vil|ale|es |n a|t f| le|bli|e e|e i|e v|het|ye | ir|al |e o|ide|iti|lit|nne|ran|t o|tal|tat|tt | ka|ans|asj|ge |inn|kon|lse|pet|t d|vi | ut|ent|eri|oli|r p|ret|ris|sto|str|t a| ga|all|ape|g s|ill|ira|kap|nn |opp|r h|rin| br| op|e m|ert|ger|ion|kal|lsk|nes| gj| mi| pr|ang|e h|e r|elt|enn|i s|ist|jen|kan|lt |nal|res|tor|ass|dre|e b|e p|mel|n t|nse|ort|per|reg|sje|t p|t v| hv| nå| va|ann|ato|e a|est|ise|isk|oil|ord|pol|ra |rak|sse|toi| gr|ak |eg |ele|g a|ige|igh|m e|n f|n v|ndr|nsk|rer|t m|und|var|år | he| no| ny|end|ete|fly|g i|ghe|ier|ind|int|lin|n d|n p|rne|sak|sie|t b|tid| al| pa| tr|ag |dig|e d|e k|ess|hol|i d|lag|led|n e|n i|n o|pri|r b|st | fe| li| ry|air|ake|d s|eas|egi",
    "ne": "को |का |मा |हरु| ने|नेप|पाल|ेपा| सम|ले | प्|प्र|कार|ा स|एको| भए| छ | भा|्रम| गर|रुक| र |भार|ारत| का| वि|भएक|ाली|ली |ा प|ीहर|ार्|ो छ|ना |रु |ालक|्या| बा|एका|ने |न्त|ा ब|ाको|ार |ा भ|ाहर|्रो|क्ष|न् |ारी| नि|ा न|ी स| डु|क्र|जना|यो |ा छ|ेवा|्ता| रा|त्य|न्द|हुन|ा क|ामा|ी न|्दा| से|छन्|म्ब|रोत|सेव|स्त|स्र|ेका|्त | बी| हु|क्त|त्र|रत |र्न|र्य|ा र|ाका|ुको| एक| सं| सु|बीब|बीस|लको|स्य|ीबी|ीसी|ेको|ो स|्यक| छन| जन| बि| मु| स्|गर्|ताह|न्ध|बार|मन्|मस्|रुल|लाई|ा व|ाई |ाल |िका| त्| मा| यस| रु|ताक|बन्|र ब|रण |रुप|रेक|ष्ट|सम्|सी |ाएक|ुका|ुक्| अध| अन| तथ| थि| दे| पर| बै|तथा|ता |दा |द्द|नी |बाट|यक्|री |रीह|र्म|लका|समस|ा अ|ा ए|ाट |िय |ो प|ो म|्न |्ने|्षा| पा| यो| हा|अधि|डुव|त भ|त स|था |धिक|पमा|बैठ|मुद|या |युक|र न|रति|वान|सार|ा आ|ा ज|ा ह|ुद्|ुपम|ुले|ुवा|ैठक|ो ब|्तर|्य |्यस| क्| मन| रह|चार|तिय|दै |निर|नु |पर्|रक्|र्द|समा|सुर|ाउन|ान |ानम|ारण|ाले|ि ब|ियो|ुन्|ुरक|्त्|्बन|्रा|्ष | आर| जल| बे| या| सा|आएक|एक |कर्|जलस|णका|त र|द्र|धान|धि |नका|नमा|नि |ममा|रम |रहे|राज|लस्|ला |वार|सका|हिल|हेक|ा त|ारे|िन्|िस्|े स|ो न|ो र|ोत |्धि|्मी|्रस| दु| पन| बत| बन| भन|ंयु|आरम|खि |ण्ड|तका|ताल|दी |देख|निय|पनि|प्त|बता|मी |म्भ|र स|रम्|लमा|विश|षाक|संय|ा ड|ा म|ानक|ालम|ि भ|ित |ी प|ी र|ु भ|ुने|े ग|ेखि|ेर |ो भ|ो व|ो ह|्भ |्र | ता| नम| ना",
    "nl": "en |de | de|et |an | he|er | va|n d|van|een|het| ge|oor| ee|der| en|ij |aar|gen|te |ver| in| me|aan|den| we|at |in | da| te|eer|nde|ter|ste|n v| vo| zi|ing|n h|voo|is | op|tie| aa|ede|erd|ers| be|eme|ten|ken|n e| ni| ve|ent|ijn|jn |mee|iet|n w|ng |nie| is|cht|dat|ere|ie |ijk|n b|rde|ar |e b|e a|met|t d|el |ond|t h| al|e w|op |ren| di| on|al |and|bij|zij| bi| hi| wi|or |r d|t v| wa|e h|lle|rt |ang|hij|men|n a|n z|rs | om|e o|e v|end|est|n t|par| pa| pr| ze|e g|e p|n p|ord|oud|raa|sch|t e|ege|ich|ien|aat|ek |len|n m|nge|nt |ove|rd |wer| ma| mi|daa|e k|lij|mer|n g|n o|om |sen|t b|wij| ho|e m|ele|gem|heb|pen|ude| bo| ja|die|e e|eli|erk|le |pro|rij| er| za|e d|ens|ind|ke |n k|nd |nen|nte|r h|s d|s e|t z| b | co| ik| ko| ov|eke|hou|ik |iti|lan|ns |t g|t m| do| le| zo|ams|e z|g v|it |je |ls |maa|n i|nke|rke|uit| ha| ka| mo| re| st| to|age|als|ark|art|ben|e r|e s|ert|eze|ht |ijd|lem|r v|rte|t p|zeg|zic|aak|aal|ag |ale|bbe|ch |e t|ebb|erz|ft |ge |led|mst|n n|oek|r i|t o|t w|tel|tte|uur|we |zit| af| li| ui|ak |all|aut|doo|e i|ene|erg|ete|ges|hee|jaa|jke|kee|kel|kom|lee|moe|n s|ort|rec|s o|s v|teg|tij|ven|waa|wel| an| au| bu| gr| pl| ti|'' |ade|dag|e l|ech|eel|eft|ger|gt |ig |itt|j d|ppe|rda",
    "nr": "oku|la |nga|a n| ng|na |ama|a i|ko | uk|ele|lo |ela|ang|a u|a k|uku|aba| ku|wa |enz|lel|ho |ni |ngo|ath|pha|eth|kha|ana|isa|nge| na|o n|tho|e n|the|ha |esi|nye|kwe|tjh| kw|ise| um|a a| ne|le |hla|a e|lan|ben|ndl| no|imi|und|ung|thi|nzi|ye |isi|uth|o e|ebe|het|kut|and|sa |elo|fun|eko|seb|ban|ulu|aka|eli|wen|e i| am|eni|ba |we |nel| we|kuf|lwa|i n| is|zi | lo|kwa|lok|elw|gok|ona|lek|hi |li |gan|bon| ii|ing|ka |o i|akh|ane|thu|ula|kel|mth| im|ga | le|nda|fan|nok|i k|end|si |o w|aph|hat|e u|ala|kub|lun|ikh|o l|ezi|a l|o u|sis|nam|emi| ab|hul|kus| wo|sek|azi|kho|iin|i u|asi|lol|ini|uph|uhl|khu|no |o y|ako|a b|i e|o k|i l| be|mal| ye|i i|nde|iph|mel|eke|tha|kun|ngi|e k|eng|o s| yo|so |ma |mkh|jha|isw|lwe| ez|di |a w|e a|kul|uny|ume|za |any|ahl|kuh|een| si|ili|itj|zok|ihl| es|ke |hlo|hak|phe|lul|dle|luk|da |eka|amb| se|zis|mbi|hon|dla|aku|jen|zin| ba|ham|i a| bo|o a|ali|use|ile|sik|han|wok|okh|hlu|nya|sit|ani|kuz|o o|ufa|swa|ind|zak|nis|lis|gab|mi | em| ko|ano| el|hwa|ufu|a y|wo | in|lim|tlo|kat|wak|kan|thw|o z|ith|ndi|yok|yo |mit|mis|abo|eku|hab|iny|nan|eze|khe|alo|lu |man|he |ezo|kup|ubu| zo|gam|hel|wan|omb|amk|nza|ola|hum|kuk|du | la|kom|i y|obu|i b|odu|okw|gap| ka|be | il|alu|atj|e b",
    "nso": "go | go| le| a |le | di|a g|ya |lo | ya|a m|ka | ka|la | t |o y|a t|a k|ba |et |wa | mo| e |a b| se| ba| ma| bo|e g|t a| o |a l|o t|na |o l|a d|elo|di |a s|o g|o k|ele|o a|ng |t e|o b|mo |e t|e m|ego|eo |e l|ngw|se |e b|kgo|ela| wa| ga|e k|ago|o m| kg|ga |dit|olo|t h|e d|o d| ye|ane|lel|we | tl|thu|ona| th|t w|hut|ana|tla|wan|aba|ola| me|gwa|re |ong|t o|lao|e s|o s|a y|alo|set|a p|i a|eng|a a|o e|tho| ke|gwe| ha|hlo|edi| la|ao | ts|aka|hla|ala|swa| we| bj|o o|gor|aga|hab|gob|let|ke |dik|sa | i |oba| hl|the|dir|a n|ith|bja|ye |no | sa|mol|lwa|ti |man|ole|e e|tse|o w|ore|to |at |eth|e y|kan|tsh|gon|net|ano|kar|ge |ho |lok| sw| na|i b|dip|i o|oka| ge| om|ko |emo|pel|nt |e a|mel|leg|tlh|me |ete|phe|a e|o n|o i|wal|oko|nya|bol|odi|weg|te |e n|ta |any|yeo|kga|pol|ang|ri |it |uto| mm|iti|are|o f|ha |gat|oth|ika|o h| it|she|ath|ale|iri|pha|ahl| te|ohl|tha| re|bon|lha| ph|din| pe|ro |mi |omi|i t| fa|aro|ase|i l|ne |lal|ogo|kol| wo|t i|omo| be|mog|mok|len|ile|lwe|ma |uta|nse|amo|a o| fe|okg|ja |pan|nag|ekg|i i|apa|get|lon|ra |aem| yo|atl|tlo|kel|tel| kh| po|e o|a w|ent|i e|bo |gan|het|mal|a f|otl|uti|oga|sen|kwa|mae|eka|mme|kge|jal|a r|ing|lek|sep|lag|ofe|wag|g y|rol|epe|eko|bok|o p|adi|log",
    "pl": "ie |nie|em | ni| po| pr|dzi| na|że |rze|na |łem|wie| w | że|go | by|prz|owa|ię | do| si|owi| pa| za|ch |ego|ał |się|ej |wał|ym |ani|ałe|to | i | to| te|e p| je| z |czy|był|pan|sta|kie| ja|do | ch| cz| wi|iał|a p|pow| mi|li |eni|zie| ta| wa|ło |ać |dy |ak |e w| a | od| st|nia|rzy|ied| kt|odz|cie|cze|ia |iel|któ|o p|tór|ści| sp| wy|jak|tak|zy | mo|ałę|pro|ski|tem|łęs| tr|e m|jes|my | ro|edz|eli|iej| rz|a n|ale|an |e s|est|le |o s|i p|ki | co|ada|czn|e t|e z|ent|ny |pre|rzą|y s| ko| o |ach|am |e n|o t|oli|pod|zia| go| ka|by |ieg|ier|noś|roz|spo|ych|ząd| mn|acz|adz|bie|cho|mni|o n|ost|pra|ze |ła | so|a m|cza|iem|ić |obi|ył |yło| mu| mó|a t|acj|ci |e b|ich|kan|mi |mie|ośc|row|zen|zyd| al| re|a w|den|edy|ił |ko |o w|rac|śmy| ma| ra| sz| ty|e j|isk|ji |ka |m s|no |o z|rez|wa |ów |łow|ść | ob|ech|ecz|ezy|i w|ja |kon|mów|ne |ni |now|nym|pol|pot|yde| dl| sy|a s|aki|ali|dla|icz|ku |ocz|st |str|szy|trz|wia|y p|za | wt|chc|esz|iec|im |la |o m|sa |wać|y n|zac|zec| gd|a z|ard|co |dar|e r|ien|m n|m w|mia|moż|raw|rdz|tan|ted|teg|wił|wte|y z|zna|zło|a r|awi|bar|cji|czą|dow|eż |gdy|iek|je |o d|tał|wal|wsz|zed|ówi|ęsa| ba| lu| wo|aln|arn|ba |dzo|e c|hod|igi|lig|m p|myś|o c|oni|rel|sku|ste|y w|yst|z w",
    "ps": " د |اؤ | اؤ|نو |ې د|ره | په|نه |چې | چې|په |ه د|ته |و ا|ونو|و د| او|انو|ونه|ه ک| دا|ه ا|دې |ښې | کې|ان |لو |هم |و م|کښې|ه م|ى ا| نو| ته| کښ|رون|کې |ده |له |به |رو | هم|ه و|وى |او |تون|دا | کو| کړ|قام| تر|ران|ه پ|ې و|ې پ| به| خو|تو |د د|د ا|ه ت|و پ|يا | خپ| دو| را| مش| پر|ارو|رې |م د|مشر| شو| ور|ار |دى | اد| دى| مو|د پ|لي |و ک| مق| يو|ؤ د|خپل|سره|ه چ|ور | تا| دې| رو| سر| مل| کا|ؤ ا|اره|برو|مه |ه ب|و ت|پښت| با| دغ| قب| له| وا| پا| پښ|د م|د ه|لې |مات|مو |ه ه|وي |ې ب|ې ک| ده| قا|ال |اما|د ن|قبر|ه ن|پار| اث| بي| لا| لر|اثا|د خ|دار|ريخ|شرا|مقا|نۍ |ه ر|ه ل|ولو|يو |کوم| دد| لو| مح| مر| وو|اتو|اري|الو|اند|خان|د ت|سې |لى |نور|و ل|ي چ|ړي |ښتو|ې ل| جو| سي|ام |بان|تار|تر |ثار|خو |دو |ر ک|ل د|مون|ندې|و ن|ول |وه |ى و|ي د|ې ا|ې ت|ې ي| حک| خب| نه| پو|ا د|تې |جوړ|حکم|حکو|خبر|دان|ر د|غه |قاف|محک|وال|ومت|ويل|ى د|ى م|يره|پر |کول|ې ه| تي| خا| وک| يا| ځا|ؤ ق|انۍ|بى |غو |ه خ|و ب|ودا|يدو|ړې |کال| بر| قد| مي| وي| کر|ؤ م|ات |ايي|تى |تيا|تير|خوا|دغو|دم |ديم|ر و|قدي|م خ|مان|مې |نيو|نږ |ه ي|و س|و چ|وان|ورو|ونږ|پور|ړه |ړو |ۍ د|ې ن| اه| زي| سو| شي| هر| هغ| ښا|اتل|اق |اني|بري|بې |ت ا|د ب|د س|ر م|رى |عرا|لان|مى |نى |و خ|وئ |ورک|ورې|ون |وکړ|ى چ|يمه|يې |ښتن|که |کړي|ې خ|ے ش| تح| تو| در| دپ| صو| عر| ول| يؤ| پۀ| څو|ا ا",
    "pt": "de | de|os |as |que| co|ão |o d| qu|ue | a |do |ent| se|a d|s d|e a|es | pr|ra |da | es| pa|to | o |em |con|o p| do|est|nte|ção| da| re|ma |par| te|ara|ida| e |ade|is | um| po|a a|a p|dad|no |te | no|açã|pro|al |com|e d|s a| as|a c|er |men|s e|ais|nto|res|a s|ado|ist|s p|tem|e c|e s|ia |o s|o a|o c|e p|sta|ta |tra|ura| di| pe|ar |e e|ser|uma|mos|se | ca|o e| na|a e|des|ont|por| in| ma|ect|o q|ria|s c|ste|ver|cia|dos|ica|str| ao| em|das|e t|ito|iza|pre|tos| nã|ada|não|ess|eve|or |ran|s n|s t|tur| ac| fa|a r|ens|eri|na |sso| si| é |bra|esp|mo |nos|ro |um |a n|ao |ico|liz|min|o n|ons|pri|ten|tic|ões| tr|a m|aga|e n|ili|ime|m a|nci|nha|nta|spe|tiv|am |ano|arc|ass|cer|e o|ece|emo|ga |o m|rag|so |são| au| os| sa|ali|ca |ema|emp|ici|ido|inh|iss|l d|la |lic|m c|mai|onc|pec|ram|s q| ci| en| fo|a o|ame|car|co |der|eir|ho |io |om |ora|r a|sen|ter| br| ex|a u|cul|dev|e u|ha |mpr|nce|oca|ove|rio|s o|sa |sem|tes|uni|ven|zaç|çõe| ad| al| an| mi| mo| ve| à |a i|a q|ala|amo|bli|cen|col|cos|cto|e m|e v|ede|gás|ias|ita|iva|ndo|o t|ore|r d|ral|rea|s f|sid|tro|vel|vid|ás | ap| ar| ce| ou| pú| so| vi|a f|act|arr|bil|cam|e f|e i|el |for|lem|lid|lo |m d|mar|nde|o o|omo|ort|per|púb|r u|rei|rem|ros|rre|ssi",
    "pt-BR": "eq |ent| en|q e|q i|g e|g i|ng | id|ida|nte|te | es| in|ade|ag |dad|de |ia |ing| br| sa|est|inq|lin|mo |nq |o a|seq| co| li| ni| o |a a|a c|ado|asi|bra|dor|iq |nta|o b|or |q n|ras|sil|str|ta |tre|us | a | ag| an| ca| e | eq| g | i | ir| nc| q | se| ve|ant|ar |cia|con|e a|eir|el |ig |ili|imo|io |ir |nci|o t|ro |vel| ap| bo| de| fr| tr|a b|a e|a g|a v|apo|as |bus|ca |cet|cin|des|e b|e s|eta|fre|i a|ibu|il |iro|la |liq|nib|nti|o c|o q|os |ra |re |req|s a|s s|san|sim|tar|to |ult| ba| ci| el| em| fi| gr| gu| ia| mu| pe| po| re| ri| si| su| te| vi|a o|a s|abe|alc|and|ara|arg|ari|ben|boc|car|co |do |e f|e g|e l|e o|em |emo|en |es |esp|exe|fic|g n|g s|gra|gua|ias|ica|idi|ila|ile|inh|l b|l e|lei|loq|mos|mul|nad|nio|nt |nto|o g|o r|oce|ont|oq |pos|q v|r b|r e|r i|r s|rad|ran|rem|rg |ria|rio|s e|s p|sta|sti|tig|til|tra|ua |ue |va |xeq| ' | ab| ad| ae| al| am| aq| ar| b | bi| bl| bu| cc| ch| di| et| ex| fa| ic| il| im| is| it| ll| m | me| na| ne| ng| nu| ob| ou| pi| qu| ss| st| ti| ub| un| v | x |' c|a d|a f|a i|a n|a p|a t|abr|aci|ad |ada|adr|aer|afe|alv|amb|amp|an |ana|ang|anh|ani|ano|anq|apa|aq |ati|ato|azi|b n|ban|bar|big|bil|biq|bli|blu|bon|bre|bri|bse|buc|c f|c i|cad|caf|cag|cal|can|cc ",
    "pt-PT": "equ|ent|que|qui|gui|uen| li|ngu|qu |uid| co| ve|de |gue|ida|nte|o a|a a|ade|dad|el |ing|mo |nqu|nta|seq|u n|vel| de| o | se|a c|ado|ar |est|ia |inq|io |iqu|lin|o c|o p|ort|por|ta |te | ag| eq| nc| pi| po| sa|a d|a e|ant|as |ca |cia|des|do |gu |imo|l p|nci|ro |rtu|str|tug|u s|ues|ui | a | an| ap| ba| bi| ca| fr| gu| in| pe| qu|agu|apa|con|dor|e f|e g|eir|fre|ho |i a|ica|igu|iro|liq|nti|o b|o l|o s|or |r o|ra |req|s c|sim|tar|to |ue |uin|ult| ci| en| ho| mu| ni| re| s | si| su|a s|a v|abe|ag |al |and|anh|apo|ata|ban|ben|bic|boi|cap|car|cin|co |com|cto|dei|e b|e o|e s|eca|en |er |es |exe|fic|for|gal|gra|ias|ich|ico|idi|ili|ir |ira|isb|la |lis|mbo|mul|na |nho|nio|nt |o q|o r|o t|oc |oio|omb|oo |os |par|pe |r b|r e|r s|ran|re |rec|s a|s s|san|sbo|so |sta|tan|tra|tre|u v|uga|ugu|xeq| ab| ad| al| am| aq| ar| au| b | bo| c | ch| ct| cu| el| es| ex| fa| fi| ga| gr| id| ir| ne| ng| nu| ob| oo| pa| ps| pt| r | ra| ri| ss| st| ta| te| tr| ub| un| vi| vo|a f|a i|a l|a m|a o|a r|ach|aci|act|ad |afa|age|agr|alf|alh|am |amb|ami|ana|ang|anq|aqu|ara|arb|arc|arg|ari|arr|asa|ati|aut|azi|b n|bar|bat|ber|big|bil|biq|bli|boa|boe|bor|bse|c i|c l|c p|cad|cam|cas|ch |cha|che|chi|cio|coc|coi|cou|ctr|cue|cul",
    "ro": " de| în|de | a |ul | co|în |re |e d|ea | di| pr|le |şi |are|at |con|ui | şi|i d|ii | cu|e a|lui|ern|te |cu | la|a c|că |din|e c|or |ulu|ne |ter|la |să |tat|tre| ac| să|est|st |tă | ca| ma| pe|cur|ist|mân|a d|i c|nat| ce|i a|ia |in |scu| mi|ato|aţi|ie | re| se|a a|int|ntr|tru|uri|ă a| fo| pa|ate|ini|tul|ent|min|pre|pro|a p|e p|e s|ei |nă |par|rna|rul|tor| in| ro| tr| un|al |ale|art|ce |e e|e î|fos|ita|nte|omâ|ost|rom|ru |str|ver| ex| na|a f|lor|nis|rea|rit| al| eu| no|ace|cer|ile|nal|pri|ri |sta|ste|ţie| au| da| ju| po|ar |au |ele|ere|eri|ina|n a|n c|res|se |t a|tea| că| do| fi|a s|ată|com|e ş|eur|guv|i s|ice|ili|na |rec|rep|ril|rne|rti|uro|uve|ă p| ar| o | su| vi|dec|dre|oar|ons|pe |rii| ad| ge|a m|a r|ain|ali|car|cat|ecu|ene|ept|ext|ilo|iu |n p|ori|sec|u p|une|ă c|şti|ţia| ch| gu|ai |ani|cea|e f|isc|l a|lic|liu|mar|nic|nt |nul|ris|t c|t p|tic|tid|u a|ucr| as| dr| fa| nu| pu| to|cra|dis|enţ|esc|gen|it |ivi|l d|n d|nd |nu |ond|pen|ral|riv|rte|sti|t d|ta |to |uni|xte|ând|îns|ă s| bl| st| uc|a b|a i|a l|air|ast|bla|bri|che|duc|dul|e m|eas|edi|esp|i l|i p|ica|ică|ir |iun|jud|lai|lul|mai|men|ni |pus|put|ra |rai|rop|sil|ti |tra|u s|ua |ude|urs|ân |înt|ţă | lu| mo| s | sa| sc|a u|an |atu",
    "ru": " на| пр|то | не|ли | по|но | в |на |ть |не | и | ко|ом |про| то|их | ка|ать|ото| за|ие |ова|тел|тор| де|ой |сти| от|ах |ми |стр| бе| во| ра|ая |ват|ей |ет |же |иче|ия |ов |сто| об|вер|го |и в|и п|и с|ии |ист|о в|ост|тра| те|ели|ере|кот|льн|ник|нти|о с|рор|ств|чес| бо| ве| да| ин| но| с | со| сп| ст| чт|али|ами|вид|дет|е н|ель|еск|ест|зал|и н|ива|кон|ого|одн|ожн|оль|ори|ров|ско|ся |тер|что| мо| са| эт|ант|все|ерр|есл|иде|ина|ино|иро|ите|ка |ко |кол|ком|ла |ния|о т|оло|ран|ред|сь |тив|тич|ых | ви| вс| го| ма| сл|ако|ани|аст|без|дел|е д|е п|ем |жно|и д|ика|каз|как|ки |нос|о н|опа|при|рро|ски|ти |тов|ые | вы| до| ме| ни| од| ро| св| чи|а н|ает|аза|ате|бес|в п|ва |е в|е м|е с|ез |ени|за |зна|ини|кам|ках|кто|лов|мер|мож|нал|ниц|ны |ным|ора|оро|от |пор|рав|рес|рис|рос|ска|т н|том|чит|шко| бы| о | тр| уж| чу| шк|а б|а в|а р|аби|ала|ало|аль|анн|ати|бин|вес|вно|во |вши|дал|дат|дно|е з|его|еле|енн|ент|ете|и о|или|ись|ит |ици|ков|лен|льк|мен|мы |нет|ни |нны|ног|ной|ном|о п|обн|ове|овн|оры|пер|по |пра|пре|раз|роп|ры |се |сли|сов|тре|тся|уро|цел|чно|ь в|ько|ьно|это|ют |я н| ан| ес| же| из| кт| ми| мы| пе| се| це|а м|а п|а т|авш|аже|ак |ал |але|ане|ачи|ают|бна|бол|бы |в и|в с|ван|гра|даж|ден|е к",
    "sk": " pr| po| ne| a |ch | na| je|ní |je | do|na |ova| v |to |ho |ou | to|ick|ter|že | st| za|ost|ých| se|pro| te|e s| že|a p| kt|pre| by| o |se |kon| př|a s|né |ně |sti|ako|ist|mu |ame|ent|ky |la |pod| ve| ob|om |vat| ko|sta|em |le |a v|by |e p|ko |eri|kte|sa |ého|e v|mer|tel| ak| sv| zá|hla|las|lo | ta|a n|ej |li |ne | sa|ak |ani|ate|ia |sou| so|ení|ie | re|ce |e n|ori|tic| vy|a t|ké |nos|o s|str|ti |uje| sp|lov|o p|oli|ová| ná|ale|den|e o|ku |val| am| ro| si|nie|pol|tra| al|ali|o v|tor| mo| ni|ci |o n|ím | le| pa| s |al |ati|ero|ove|rov|ván|ích| ja| z |cké|e z| od|byl|de |dob|nep|pra|ric|spo|tak| vš|a a|e t|lit|me |nej|no |nýc|o t|a j|e a|en |est|jí |mi |slo|stá|u v|for|nou|pos|pře|si |tom| vl|a z|ly |orm|ris|za |zák| k |at |cký|dno|dos|dy |jak|kov|ny |res|ror|sto|van| op|da |do |e j|hod|len|ný |o z|poz|pri|ran|u s| ab|aj |ast|it |kto|o o|oby|odo|u p|va |ání|í p|ým | in| mi|ať |dov|ka |nsk|áln| an| bu| sl| tr|e m|ech|edn|i n|kýc|níc|ov |pří|í a| aj| bo|a d|ide|o a|o d|och|pov|svo|é s| kd| vo| vý|bud|ich|il |ili|ni |ním|od |osl|ouh|rav|roz|st |stv|tu |u a|vál|y s|í s|í v| hl| li| me|a m|e b|h s|i p|i s|iti|lád|nem|nov|opo|uhl|eno|ens|men|nes|obo|te |ved|vlá|y n| ma| mu| vá|bez|byv|cho",
    "sl": "je | pr| po| je| v | za| na|pre|da | da|ki |ti |ja |ne | in|in |li |no |na |ni | bi|jo | ne|nje|e p|i p|pri|o p|red| do|anj|em |ih | bo| ki| iz| se| so|al | de|e v|i s|ko |bil|ira|ove| br| ob|e b|i n|ova|se |za |la | ja|ati|so |ter| ta|a s|del|e d| dr| od|a n|ar |jal|ji |rit| ka| ko| pa|a b|ani|e s|er |ili|lov|o v|tov| ir| ni| vo|a j|bi |bri|iti|let|o n|tan|še | le| te|eni|eri|ita|kat|por|pro|ali|ke |oli|ov |pra|ri |uar|ve | to|a i|a v|ako|arj|ate|di |do |ga |le |lo |mer|o s|oda|oro|pod| ma| mo| si|a p|bod|e n|ega|ju |ka |lje|rav|ta |a o|e t|e z|i d|i v|ila|lit|nih|odo|sti|to |var|ved|vol| la| no| vs|a d|agu|aja|dej|dnj|eda|gov|gua|jag|jem|kon|ku |nij|omo|oči|pov|rak|rja|sta|tev|a t|aj |ed |eja|ent|ev |i i|i o|ijo|ist|ost|ske|str| ra| s | tr| še|arn|bo |drž|i j|ilo|izv|jen|lja|nsk|o d|o i|om |ora|ovo|raz|rža|tak|va |ven|žav| me| če|ame|avi|e i|e o|eka|gre|i t|ija|il |ite|kra|lju|mor|nik|o t|obi|odn|ran|re |sto|stv|udi|v i|van| am| sp| st| tu| ve| že|ajo|ale|apo|dal|dru|e j|edn|ejo|elo|est|etj|eva|iji|ik |im |itv|mob|nap|nek|pol|pos|rat|ski|tič|tom|ton|tra|tud|tve|v b|vil|vse|čit| av| gr|a z|ans|ast|avt|dan|e m|eds|for|i z|kot|mi |nim|o b|o o|od |odl|oiz|ot |par|pot|rje|roi|tem|val",
    "so": "ka |ay |da | ay|aal|oo |aan| ka|an |in | in|ada|maa|aba| so|ali|bad|add|soo| na|aha|ku |ta | wa|yo |a s|oma|yaa| ba| ku| la| oo|iya|sha|a a|dda|nab|nta| da| ma|nka|uu |y i|aya|ha |raa| dh| qa|a k|ala|baa|doo|had|liy|oom| ha| sh|a d|a i|a n|aar|ee |ey |y k|ya | ee| iy|aa |aaq|gaa|lam| bu|a b|a m|ad |aga|ama|iyo|la |a c|a l|een|int|she|wax|yee| si| uu|a h|aas|alk|dha|gu |hee|ii |ira|mad|o a|o k|qay| ah| ca| wu|ank|ash|axa|eed|en |ga |haa|n a|n s|naa|nay|o d|taa|u b|uxu|wux|xuu| ci| do| ho| ta|a g|a u|ana|ayo|dhi|iin|lag|lin|lka|o i|san|u s|una|uun| ga| xa| xu|aab|abt|aq |aqa|ara|arl|caa|cir|eeg|eel|isa|kal|lah|ney|qaa|rla|sad|sii|u d|wad| ad| ar| di| jo| ra| sa| u | yi|a j|a q|aad|aat|aay|ah |ale|amk|ari|as |aye|bus|dal|ddu|dii|du |duu|ed |ege|gey|hay|hii|ida|ine|joo|laa|lay|mar|mee|n b|n d|n m|no |o b|o l|oog|oon|rga|sh |sid|u q|unk|ush|xa |y d| bi| gu| is| ke| lo| me| mu| qo| ug|a e|a o|a w|adi|ado|agu|al |ant|ark|asa|awi|bta|bul|d a|dag|dan|do |e s|gal|gay|guu|h e|hal|iga|ihi|iri|iye|ken|lad|lid|lsh|mag|mun|n h|n i|na |o n|o w|ood|oor|ora|qab|qor|rab|rit|rta|s o|sab|ska|to |u a|u h|u u|ud |ugu|uls|uud|waa|xus|y b|y q|y s|yad|yay|yih| aa| bo| br| go| ji| mi| of| ti| um| wi| xo|a x",
    "sq": "të | të|në |për| pë| e |sht| në| sh|se |et |ë s|ë t| se|he |jë |ër |dhe| pa|ë n|ë p| që| dh|një|ë m| nj|ësh|in | me|që | po|e n|e t|ish|më |së |me |htë| ka| si|e k|e p| i |anë|ar | nu|und|ve | ës|e s| më|nuk|par|uar|uk |jo |rë |ta |ë f|en |it |min|het|n e|ri |shq|ë d| do| nd|sh |ën |atë|hqi|ist|ë q| gj| ng| th|a n|do |end|imi|ndi|r t|rat|ë b|ëri| mu|art|ash|qip| ko|e m|edh|eri|je |ka |nga|si |te |ë k|ësi| ma| ti|eve|hje|ira|mun|on |po |re | pr|im |lit|o t|ur |ë e|ë v|ët | ku| së|e d|es |ga |iti|jet|ndë|oli|shi|tje| bë| z |gje|kan|shk|ënd|ës | de| kj| ru| vi|ara|gov|kjo|or |r p|rto|rug|tet|ugo|ali|arr|at |d t|ht |i p|ipë|izi|jnë|n n|ohe|shu|shë|t e|tik|a e|arë|etë|hum|nd |ndr|osh|ova|rim|tos|va | fa| fi|a s|hen|i n|mar|ndo|por|ris|sa |sis|tës|umë|viz|zit| di| mb|aj |ana|ata|dër|e a|esh|ime|jes|lar|n s|nte|pol|r n|ran|res|rrë|tar|ë a|ë i| at| jo| kë| re|a k|ai |akt|hë |hën|i i|i m|ia |men|nis|shm|str|t k|t n|t s|ë g|ërk|ëve| ai| ci| ed| ja| kr| qe| ta| ve|a p|cil|el |erë|gji|hte|i t|jen|jit|k d|mën|n t|nyr|ori|pas|ra |rie|rës|tor|uaj|yre|ëm |ëny| ar| du| ga| je|dës|e e|e z|ha |hme|ika|ini|ite|ith|koh|kra|ku |lim|lis|qën|rën|s s|t d|t t|tir|tën|ver|ë j| ba| in| tr| zg|a a|a m|a t|abr",
    "sr": " на| је| по|је | и | не| пр|га | св|ог |а с|их |на |кој|ога| у |а п|не |ни |ти | да|ом | ве| ср|и с|ско| об|а н|да |е н|но |ног|о ј|ој | за|ва |е с|и п|ма |ник|обр|ова| ко|а и|диј|е п|ка |ко |ког|ост|све|ств|сти|тра|еди|има|пок|пра|раз|те | бо| ви| са|аво|бра|гос|е и|ели|ени|за |ики|ио |пре|рав|рад|у с|ју |ња | би| до| ст|аст|бој|ебо|и н|им |ку |лан|неб|ово|ого|осл|ојш|пед|стр|час| го| кр| мо| чл|а м|а о|ако|ача|вел|вет|вог|еда|ист|ити|ије|око|сло|срб|чла| бе| ос| от| ре| се|а в|ан |бог|бро|вен|гра|е о|ика|ија|ких|ком|ли |ну |ота|ојн|под|рбс|ред|рој|са |сни|тач|тва|ја |ји | ка| ов| тр|а ј|ави|аз |ано|био|вик|во |гов|дни|е ч|его|и о|ива|иво|ик |ине|ини|ипе|кип|лик|ло |наш|нос|о т|од |оди|она|оји|поч|про|ра |рис|род|рст|се |спо|ста|тић|у д|у н|у о|чин|ша |јед|јни|ће | м | ме| ни| он| па| сл| те|а у|ава|аве|авн|ана|ао |ати|аци|ају|ања|бск|вор|вос|вск|дин|е у|едн|ези|ека|ено|ето|ења|жив|и г|и и|и к|и т|ику|ичк|ки |крс|ла |лав|лит|ме |мен|нац|о н|о п|о у|одн|оли|орн|осн|осп|оче|пск|реч|рпс|сво|ски|сла|срп|су |та |тав|тве|у б|јез|ћи | ен| жи| им| му| од| су| та| хр| ча| шт| ње|а д|а з|а к|а т|аду|ало|ани|асо|ван|вач|вањ|вед|ви |вно|вот|вој|ву |доб|дру|дсе|ду |е б|е д|е м|ем |ема|ент|енц",
    "ss": " ku| le|la |eku|a k|nga| ng|a n|nge|a l|lo | ne|eti|kwe|ndz|e n|o l| lo|ela|ema|ent|si | kw|tsi|i l|wa |lel|kut|e k|und|ni |elo|fun|esi| si|ele|tin|tfo| ti|le |kha|tse|e l|pha|ung|i k| em|ti |sa | um|isa|eli|ndl|ing|set|we |ise|na |ang|etf|khe|and|o n| we|nti|nye|tfu|ben|a e|uts|let|dza|imi|sek|ko |lok|eni|ye |ba |nkh|ebe|alo|o k|lan|ga |aba|seb| ye|he |lwa|kel| te| la|kus|wem|ati|ikh|nek|ala|kuf|i n|oku|ats|mts|hla|wen|a t| na|gek|uhl|kub|ngu|ka |aka|fut|kan|kwa| li|kuc|onk|ban|ana|ulu| se| im|akh|ume|a i|les|tim|ula|ini|lwe|za |fo |hul| no|han|li |iph|a s|tis|khu|ta |dzi|be |emi|ma |end|o t|eke|a u| ka|ane|lek|mel|elw|kun|sis|lon|utf|any|kho|kul|hlo| ba|ufu|aph|lun|e s|hal|ind|isw|o s|use|ekw|me |ndv|eng|uph|hat|ne |so |lul|nom|te |lol|awu|nel|lu |ha |wat|men|ete| lw|nem|ako|zin|kuh|sha|bha|gab| in|ale|mis|tem|e e|o e|e t|wek|dze|ome|wel| lu|emb|nis| ek|tsa|u l|o y|dle|ute|len|swa|phe|mkh|ntf|uke|sit|iny|e i|wo |ani|phi|wet|sin|nhl|mal|mba|mfu|fu |lab|sik|taw|no |hle|e u|eki|ase|ali|ulw|ve |eka|zel|nta|bon|tek|bo |sig|ama|ile|ule|tfw|mph|uma|kup|emt|asi|dlu|ish|umt|gen|o w|ike|iga|hak|abe|net|gan|kis|nde|ngi|ukh|bek|mo |phu|sel|elu|i t|ant|dvo|a y|vo |hum|lis|dla|gam|ive|jen|ket",
    "st": "ng |ho | le|le | ho| ts|a m|sa |la | ka|a h| di|ya |ka | ya|a t|eng|ets| ba| mo|a l| se|lo | bo|wa |tsa|a b|na |ba | e | a |a k| ma|ang|tse|se |o t|a d|a s|ha |so |o l|e h|o y|e t|tla|tsh|olo|e l|e m|o b|o e|seb|ebe|ela|thu|ele|e k|ana|e b| th| ha|tso|o a|o k| wa|kgo|tsw|tho|o h|ong| la|hut|dit|ane| me|a e| tl|ola|edi|elo|di |ona| ke|wan| o |a p|apa|tjh|hlo| sa|she|let|aba|lok|lao|eo |a a|o s|man|to | hl|a n|isa|e d|swe|set|pa | na|o m|g l|het| kg|got|aha|eth|re |e e|jha|phe|lan|otl|g k|lek|its|ekg|sen|ao |dis|g m|oth|e a|ith|hla|e s|ke |mol|pel|g h|hab|bet|san|ats|mo |lwa|we |ala|len|nts|dip|kap|iso| mm|uto|alo|e n|si |ta |o w|emo|swa|tsi|oke|bed|the| ph|a y|wen|ken|ena|hwa|ne |ore|atl|ano|hel|mot|bo |g t|i b|kga|hor|ngo|nan|no |o n|tlh|shw|kel|pha|etj|bon|ell|g s|gol|tha|ale|dik|kol|bak| nt|ika|o d| te|ohl|g y| lo|ti |his|ile|g b|oko| et|han|a o|mat|oho|odi|lel|mel|din|kar|o o|uo |mon|hah|te |me | it|o f|nen|heb|ing|bol|bel|hle|puo|lal|tlo|hal|oph|eba|hat|heo|aro|bat|ko |ban|leh|o i|ole|tle| fe|kge|pan|ake|g e|aka|eko| pe|rik|e y|mme|ama|lha|eha| fa|ebo|moh|mae|ete|aem|ots|ahi|o p|uta|okg|ntl|pal|get|i l|e f|oka|sep|lat|ahl|bot|ese|lah|lon|akg|a f| pu|ase|g a|mor|kan|nah|boh|e p",
    "sv": "en | de|et |er |tt |om |för|ar |de |att| fö|ing| in| at| i |det|ch |an |gen| an|t s|som|te | oc|ter| ha|lle|och| sk| so|ra |r a| me|var|nde|är | ko|on |ans|int|n s|na | en| fr| på| st| va|and|nte|på |ska|ta | vi|der|äll|örs| om|da |kri|ka |nst| ho|as |stä|r d|t f|upp| be|nge|r s|tal|täl|ör | av|ger|ill|ng |e s|ekt|ade|era|ers|har|ll |lld|rin|rna|säk|und|inn|lig|ns | ma| pr| up|age|av |iva|kti|lda|orn|son|ts |tta|äkr| sj| ti|avt|ber|els|eta|kol|men|n d|t k|vta|år |juk|man|n f|nin|r i|rsä|sju|sso| är|a s|ach|ag |bac|den|ett|fte|hor|nba|oll|rnb|ste|til| ef| si|a a|e h|ed |eft|ga |ig |it |ler|med|n i|nd |så |tiv| bl| et| fi| sä|at |des|e a|gar|get|lan|lss|ost|r b|r e|re |ret|sta|t i| ge| he| re|a f|all|bos|ets|lek|let|ner|nna|nne|r f|rit|s s|sen|sto|tor|vav|ygg| ka| så| tr| ut|ad |al |are|e o|gon|kom|n a|n h|nga|r h|ren|t d|tag|tar|tre|ätt| få| hä| se|a d|a i|a p|ale|ann|ara|byg|gt |han|igt|kan|la |n o|nom|nsk|omm|r k|r p|r v|s f|s k|t a|t p|ver| bo| br| ku| nå|a b|a e|del|ens|es |fin|ige|m s|n p|någ|or |r o|rbe|rs |rt |s a|s n|skr|t o|ten|tio|ven| al| ja| p | r | sa|a h|bet|cke|dra|e f|e i|eda|eno|erä|ess|ion|jag|m f|ne |nns|pro|r t|rar|riv|rät|t e|t t|ust|vad|öre| ar| by| kr| mi|arb",
    "sw": " wa|wa |a k|a m| ku| ya|a w|ya |ni | ma|ka |a u|na |za |ia | na|ika|ma |ali|a n| am|ili|kwa| kw|ini| ha|ame|ana|i n| za|a h|ema|i m|i y|kuw|la |o w|a y|ata|sem| la|ati|chi|i w|uwa|aki|li |eka|ira| nc|a s|iki|kat|nch| ka| ki|a b|aji|amb|ra |ri |rik|ada|mat|mba|mes|yo |zi |da |hi |i k|ja |kut|tek|wan| bi|a a|aka|ao |asi|cha|ese|eza|ke |moj|oja| hi|a z|end|ha |ji |mu |shi|wat| bw|ake|ara|bw |i h|imb|tik|wak|wal| hu| mi| mk| ni| ra| um|a l|ate|esh|ina|ish|kim|o k| ir|a i|ala|ani|aq |azi|hin|i a|idi|ima|ita|rai|raq|sha| ms| se|afr|ama|ano|ea |ele|fri|go |i i|ifa|iwa|iyo|kus|lia|lio|maj|mku|no |tan|uli|uta|wen| al|a j|aad|aid|ari|awa|ba |fa |nde|nge|nya|o y|u w|ua |umo|waz|ye | ut| vi|a d|a t|aif|di |ere|ing|kin|nda|o n|oa |tai|toa|usa|uto|was|yak|zo | ji| mw|a p|aia|amu|ang|bik|bo |del|e w|ene|eng|ich|iri|iti|ito|ki |kir|ko |kuu|mar|mbo|mil|ngi|ngo|o l|ong|si |ta |tak|u y|umu|usi|uu |wam| af| ba| li| si| zi|a v|ami|atu|awi|eri|fan|fur|ger|i z|isi|izo|lea|mbi|mwa|nye|o h|o m|oni|rez|saa|ser|sin|tat|tis|tu |uin|uki|ur |wi |yar| da| en| mp| ny| ta| ul| we|a c|a f|ais|apo|ayo|bar|dhi|e a|eke|eny|eon|hai|han|hiy|hur|i s|imw|kal|kwe|lak|lam|mak|msa|ne |ngu|ru |sal|swa|te |ti |uku|uma|una|uru",
    "tl": "ng |ang| na| sa|an |nan|sa |na | ma| ca|ay |n g| an|ong| ga|at | pa|ala| si|a n|ga |g n|g m|ito|g c|man|san|g s|ing|to |ila|ina| di| ta|aga|iya|aca|g t| at|aya|ama|lan|a a|qui|a c|a s|nag| ba|g i|tan|'t | cu|aua|g p| ni|os |'y |a m| n |la | la|o n|yan| ay|usa|cay|on |ya | it|al |apa|ata|t n|uan|aha|asa|pag| gu|g l|di |mag|aba|g a|ara|a p|in |ana|it |si |cus|g b|uin|a t|as |n n|hin| hi|a't|ali| bu|gan|uma|a d|agc|aqu|g d| tu|aon|ari|cas|i n|niy|pin|a i|gca|siy|a'y|yao|ag |ca |han|ili|pan|sin|ual|n s|nam| lu|can|dit|gui|y n|gal|hat|nal| is|bag|fra| fr| su|a l| co|ani| bi| da|alo|isa|ita|may|o s|sil|una| in| pi|l n|nil|o a|pat|sac|t s| ua|agu|ail|bin|dal|g h|ndi|oon|ua | ha|ind|ran|s n|tin|ulo|eng|g f|ini|lah|lo |rai|rin|ton|g u|inu|lon|o'y|t a| ar|a b|ad |bay|cal|gya|ile|mat|n a|pau|ra |tay|y m|ant|ban|i m|nas|nay|no |sti| ti|ags|g g|ta |uit|uno| ib| ya|a u|abi|ati|cap|ig |is |la'| do| pu|api|ayo|gos|gul|lal|tag|til|tun|y c|y s|yon|ano|bur|iba|isi|lam|nac|nat|ni |nto|od |pa |rgo|urg| m |adr|ast|cag|gay|gsi|i p|ino|len|lin|m g|mar|nah|to'| de|a h|cat|cau|con|iqu|lac|mab|min|og |par|sal| za|ao |doo|ipi|nod|nte|uha|ula| re|ill|lit|mac|nit|o't|or |ora|sum|y p| al| mi| um|aco|ada|agd|cab",
    "tlh": "tlh|e' |gh |i' | 'e|u' | vi|atl|a' | gh|ej | ho| ch| mu| tl|nga|mey|wi'|be'|an |ch |gan|chu|lh |ing|'e'|hin|jat|lhi| da| ja|o' |ugh|aq |cha| po|ey | 'a| je|'ej| pa|ng |ad | qa|oh |eh |ah |gha|je | lu|hol|aw'| ji|ong|pu'|aj |vad|w' |' j|ha'|is |tah|' '|ang|h '|pon|am |law|mo'|qu'|hbe|ol |vam|agh|mu'|ahv|bej|ogh|uch|' v|ach|hug| lo| qu|cho|hva|ij | la|lu'|vis| ne| pu| so| ta| va|'ac|di'|hu'|lah|moh| 'o|' m|daq|hah|n h|neh|u'm|ay'|gho|h v|meh|oy | ma| nu|'me|el | ba| be| de| ng|' t|h d|hvi|oq | wa|' l|'wi|hme|li'|uq | bo|bog|del|h p|h t|ich|vil| qe| wi|ahb|ban|eng|haq|hoh|ov |viq| ha| ti|' n|' p|'a'|hwi|igh|lo'|y' | du| no| yu|'mo|'va|daj|das|egh|hom|muc|om |otl|us | bi| tu|' h|chm|h q|hov|nis|qar|uj |' q|'ch|h m|hmo|jih|par|wij| hu|' d|'a |etl|h g|h j|h l|lod|maq|och|wa'|yuq| di| le| pe| ya|'di|che|ech|ih |ija|in |j '|j m|lhw|pa'| 'i| mi| qi| ro| ru|'be|anp|ghi|ghu|h b|hay|hch|iq |npu|od |paq|qay|rda|soh| do| me| qo| sa|' c|' g|' s|'lu|aml|ard|as |d p|gme|h n|hta|i'v|j j|jij|len|ngm|qan|qme|vaj|wiv| mo| ni|'la|'pu|'qu|ar |arm|dwi|g p|ghd|h c|ham|hla|hqu|ilo|iqa|iqi|j p|j t|j v|lad|lho|mar|mug|pus|q s|q t|rgh|rma|sov|ta'|tin|tu'|u'd|vet|yli|yu'| to|'oh|aqq|art|at |ayl|ayt|et |haj|har",
    "tn": " di| le|go |le | go|ng | ts|ya | ya|sa |tlh| mo| bo|a m|lo |tsa| e |o t|a b|wa | ka|a k|a t|ka |a g|eng|olo|o y|la | a |a d|ets|mo |se | tl| ba|tsh| ma|ba |a l|tse|so |na |elo| se|ele|e d|o l|lho|e t|di |e g| kg|dit|kgo|o k|ang|lha|e m|e e|we |ane|o m|e k|e l|ong|set|wan|ela|tso|tla|o d|e b|ola|ngw|gwe|o b|aba|atl|a p| o |a a|o a|otl|a s|o e|dir|thu|ga | ga|shw|ots|aka|hab|hwa|aga|o g|gan|tsw|ana|mol| ke|hut| me|ona|lel|its|lao|kga|dik|got| fa|let| wa|ose|no |t h|swe|edi|ats|a n|e s|oko|oth|kwa|kar| th|a e|ala|tir|o n|dip|isa|gat|ti |ano|bot| nn| ha|len|alo|any|aro|iti|iri|o s|sen|net|ke |ho |mai|ika|eka|to |ith|re |g m|hat|bo |g l|et |emo|ama|iso|rol|fa |iwa|kan|she|si |ao |g k|wen|lol|o o|bos|itl|a y|the|lwa|e n| la|ore| mm|ko |tha|e a|eo |lhe|bol|ha | po|isi|i b|lan| na|i t|ale|ne |gon|ris|ira|bon| sa|g y|g g|pha|oga|mel|ro |gol|o w| kw|i l| ti|tlo|log|por| ja|a f| ne|hok|lot| pu|e y|uto|g t|hom|okg| ko|o f|ame|gor|ta | pe|nts| kh|tho|gel|adi|are|ete|ase|mon|heo|oro|omo|nen|nel|ile|nng|ntl|abo|ogo|ara|nse|ego|hel|uo |mog|san|ula|rag|kol|te |etl|bat| te|puo|amo|ofe|lat|ati|ole|rab|tsi|iro|man|ael|ega|lwe|ra |din|tle|sek|ing|yo |a o| re|aot|uso|o r|ere|jwa|aem|lam|lek| jw|gwa|mok",
    "tr": "lar|en |ler|an |in | bi| ya|eri|de | ka|ir |arı| ba| de| ha|ın |ara|bir| ve| sa|ile|le |nde|da | bu|ana|ini|ını|er |ve | yı|lma|yıl| ol|ar |n b|nda|aya|li |ası| ge|ind|n k|esi|lan|nla|ak |anı|eni|ni |nı |rın|san| ko| ye|maz|baş|ili|rin|alı|az |hal|ınd| da| gü|ele|ılm|ığı|eki|gün|i b|içi|den|kar|si | il|e y|na |yor|ek |n s| iç|bu |e b|im |ki |len|ri |sın| so|ün | ta|nin|iği|tan|yan| si|nat|nın|kan|rı |çin|ğı |eli|n a|ır | an|ine|n y|ola| ar|al |e s|lik|n d|sin| al| dü|anl|ne |ya |ım |ına| be|ada|ala|ama|ilm|or |sı |yen| me|atı|di |eti|ken|la |lı |oru| gö| in|and|e d|men|un |öne|a d|at |e a|e g|yar| ku|ayı|dan|edi|iri|ünü|ği |ılı|eme|eği|i k|i y|ıla| ça|a y|alk|dı |ede|el |ndı|ra |üne| sü|dır|e k|ere|ik |imi|işi|mas|n h|sür|yle| ad| fi| gi| se|a k|arl|aşı|iyo|kla|lığ|nem|ney|rme|ste|tı |unl|ver| sı| te| to|a s|aşk|ekl|end|kal|liğ|min|tır|ulu|unu|yap|ye |ı i|şka|ştı| bü| ke| ki|ard|art|aşa|n i|ndi|ti |top|ı b| va| ön|aki|cak|ey |fil|isi|kle|kur|man|nce|nle|nun|rak|ık | en| yo|a g|lis|mak|n g|tir|yas| iş| yö|ale|bil|bul|et |i d|iye|kil|ma |n e|n t|nu |olu|rla|te |yön|çık| ay| mü| ço| çı|a a|a b|ata|der|gel|i g|i i|ill|ist|ldı|lu |mek|mle|n ç|onu|opl|ran|rat|rdı|rke|siy|son|ta |tçı|tın",
    "ts": " ku|ku |na |ka |wa |a n| sw|a m|ya |a k| ti|swi|hi |la | ya| le| hi|a t|a v| va|ni | na|ndz| ma|a h| xi|a s|i n|ele|i k|ana|a l|nga|lo |va |le |aka|ela|irh|eka| vu|iwa|a x| ka|yi | wa|isa|sa |ko |ta |ga |wu |wi |tir| ek| mi| ni|o y|elo|awu|isi|swa|i t|hla|a e| ta| ng| la|a y|ri |eri| ri|rhi|eke|umb|u t|ndl| yi|lan|i v|esw|mbe|i l|a r|e k|ang|les|ula|ti |yon|o w|ona|law|xa |nel|yo |lel|iko| lo|amb| a |i y| xa|ane|wan|i s|ond|fan|end|i h|o l|u k|mbi|n'w|ke |dyo| fa|lam|nhl|o s|ong|no | ko|u n| ha|ho |oko|u h|i m|o n| yo|ngu|o k|u y|ati|u l|van|ulu|and|mba|kum|u v|wo |be |ha |riw|dza|si | en|o h| hl|o t|eyi| nt|ila|lok|dzi|nge| mu|ala|to |a w| by|arh|aku|tsa|wak|rho|'wa| nd|min|lav|tim|ley|tik|dle|tin|mat|ler|let|sel|his|mel|lu |ika|a a|ngo|eng|o x| nk|amu|siw|ani|eni|ma | nh|mi |swo|eti|tan|mo |ham|iwe| kh|han|lek|nti|ung|hak|dzo|ete| ts|ava|hu |fum|kar|vul| wu|kul|und|i x|nhu|yis|xik|bis|xi |e y|ra |hle| hu|wek|ano|yen|a d|sis|olo|pfu|i w|nyi|e n|so |ki |fun|iso|tsh|kon|nku|hel|i b|e h|ari|imi|i e|ind|vum|nts|ime|kom|mfu|ise| mf|hin|dla|vut|gan|i r|ban|bya|mil|int|ats| dy|u s|e x|ile|kel|kwa| no|i f|asi|za |uri|o m|rha|e l|in'|eta|von|i a|kho| wo|iki| ra|u e|o e|zo |yin|ink|any|ket",
    "uk": " на| за|ння|ня |на | пр|ого|го |ськ| по| у |від|ере| мі| не|их |ть |пер| ві|ів | пе| що|льн|ми |ні |не |ти |ати|енн|міс|пра|ува|ник|про|рав|івн| та|буд|влі|рів| ко| рі|аль|но |ому|що | ви|му |рев|ся |інн| до| уп|авл|анн|ком|ли |лін|ног|упр| бу| з | ро|за |и н|нов|оро|ост|ста|ті |ють| мо| ні| як|бор|ва |ван|ень|и п|нь |ові|рон|сті|та |у в|ько|іст| в | ре|до |е п|заб|ий |нсь|о в|о п|при|і п| ку| пі| сп|а п|або|анс|аці|ват|вни|и в|ими|ка |нен|ніч|она|ої |пов|ьки|ьно|ізн|ічн| ав| ма| ор| су| чи| ін|а з|ам |ає |вне|вто|дом|ент|жит|зни|им |итл|ла |них|ниц|ова|ови|ом |пор|тьс|у р|ься|ідо|іль|ісь| ва| ді| жи| че| і |а в|а н|али|вез|вно|еве|езе|зен|ицт|ки |ких|кон|ку |лас|ля |мож|нач|ним|ної|о б|ову|оди|ою |ро |рок|сно|спо|так|тва|ту |у п|цтв|ьни|я з|і м|ії | вс| гр| де| но| па| се| ук| їх|а о|авт|аст|ают|вар|ден|ди |ду |зна|и з|ико|ися|ити|ког|мен|ном|ну |о н|о с|обу|ово|пла|ран|рив|роб|ска|тан|тим|тис|то |тра|удо|чин|чни|і в|ію | а | во| да| кв| ме| об| ск| ти| фі| є |а р|а с|а у|ак |ані|арт|асн|в у|вик|віз|дов|дпо|дів|еві|енс|же |и м|и с|ика|ичн|кі |ків|між|нан|нос|о у|обл|одн|ок |оло|отр|рен|рим|роз|сь |сі |тла|тів|у з|уго|уді|чи |ше |я н|я у|ідп|ій |іна|ія | ка| ни| ос| си| то| тр| уг",
    "ur": "یں | کی|کے | کے|نے | کہ|ے ک|کی |میں| می|ہے |وں |کہ | ہے|ان |ہیں|ور | کو|یا | ان| نے|سے | سے| کر|ستا| او|اور|تان|ر ک|ی ک| اس|ے ا| پا| ہو| پر|رف | کا|ا ک|ی ا| ہی|در |کو | ای|ں ک| مش| مل|ات |صدر|اکس|شرف|مشر|پاک|کست|ی م| دی| صد| یہ|ا ہ|ن ک|وال|یہ |ے و| بھ| دو|اس |ر ا|نہی|کا |ے س|ئی |ہ ا|یت |ے ہ|ت ک| سا|لے |ہا |ے ب| وا|ار |نی |کہا|ی ہ|ے م| سی| لی|انہ|انی|ر م|ر پ|ریت|ن م|ھا |یر | جا| جن|ئے |پر |ں ن|ہ ک|ی و|ے د| تو| تھ| گی|ایک|ل ک|نا |کر |ں م|یک | با|ا ت|دی |ن س|کیا|یوں|ے ج|ال |تو |ں ا|ے پ| چا|ام |بھی|تی |تے |دوس|س ک|ملک|ن ا|ہور|یے | مو| وک|ائی|ارت|الے|بھا|ردی|ری |وہ |ویز|ں د|ھی |ی س| رہ| من| نہ| ور| وہ| ہن|ا ا|است|ت ا|ت پ|د ک|ز م|ند |ورد|وکل|گی |گیا|ہ پ|یز |ے ت| اع| اپ| جس| جم| جو| سر|اپن|اکث|تھا|ثری|دیا|ر د|رت |روی|سی |ملا|ندو|وست|پرو|چاہ|کثر|کلا|ہ ہ|ہند|ہو |ے ل| اک| دا| سن| وز| پی|ا چ|اء |اتھ|اقا|اہ |تھ |دو |ر ب|روا|رے |سات|ف ک|قات|لا |لاء|م م|م ک|من |نوں|و ا|کرن|ں ہ|ھار|ہوئ|ہی |یش | ام| لا| مس| پو| پہ|انے|ت م|ت ہ|ج ک|دون|زیر|س س|ش ک|ف ن|ل ہ|لاق|لی |وری|وزی|ونو|کھن|گا |ں س|ں گ|ھنے|ھے |ہ ب|ہ ج|ہر |ی آ|ی پ| حا| وف| گا|ا ج|ا گ|اد |ادی|اعظ|اہت|جس |جمہ|جو |ر س|ر ہ|رنے|س م|سا |سند|سنگ|ظم |عظم|ل م|لیے|مل |موہ|مہو|نگھ|و ص|ورٹ|وہن|کن |گھ |گے |ں ج|ں و|ں ی|ہ د|ہن |ہوں|ے ح|ے گ|ے ی| اگ| بع| رو| شا",
    "uz": "ан |ган|лар|га |нг |инг|нин|да |ни |ида|ари|ига|ини|ар |ди | би|ани| бо|дан|лга| ҳа| ва| са|ги |ила|н б|и б| кў| та|ир | ма|ага|ала|бир|ри |тга|лан|лик|а к|аги|ати|та |ади|даг|рга| йи| ми| па| бў| қа| қи|а б|илл|ли |аси|и т|ик |или|лла|ард|вчи|ва |иб |ири|лиг|нга|ран| ке| ўз|а с|ахт|бўл|иги|кўр|рда|рни|са | бе| бу| да| жа|а т|ази|ери|и а|илг|йил|ман|пах|рид|ти |увч|хта| не| со| уч|айт|лли|тла| ай| фр| эт| ҳо|а қ|али|аро|бер|бил|бор|ими|ист|он |рин|тер|тил|ун |фра|қил| ба| ол|анс|ефт|зир|кат|мил|неф|саг|чи |ўра| на| те| эн|а э|ам |арн|ат |иш |ма |нла|рли|чил|шга| иш| му| ўқ|ара|ваз|и у|иқ |моқ|рим|учу|чун|ши |энг|қув|ҳам| сў| ши|бар|бек|дам|и ҳ|иши|лад|оли|олл|ори|оқд|р б|ра |рла|уни|фт |ўлг|ўқу| де| ка| қў|а ў|аба|амм|атл|б к|бош|збе|и в|им |ин |ишл|лаб|лей|мин|н д|нда|оқ |р м|рил|сид|тал|тан|тид|тон|ўзб| ам| ки|а ҳ|анг|анд|арт|аёт|дир|ент|и д|и м|и о|и э|иро|йти|нсу|оди|ор |си |тиш|тоб|эти|қар|қда| бл| ге| до| ду| но| пр| ра| фо| қо|а м|а о|айд|ало|ама|бле|г н|дол|ейр|ек |ерг|жар|зид|и к|и ф|ий |ило|лди|либ|лин|ми |мма|н в|н к|н ў|н ҳ|ози|ора|оси|рас|риш|рка|роқ|сто|тин|хат|шир| ав| рў| ту| ўт|а п|авт|ада|аза|анл|б б|бой|бу |вто|г э|гин|дар|ден|дун|иде|ион|ирл|ишг|йха|кел|кўп|лио",
    "ve": "ha | vh|a m|na | u |a n|tsh|wa |a u| na|nga|vha| ts| dz| kh|dza|a v|ya | ya|a t|ho |la | zw| mu|edz|vhu|ga |shi|za |a k| ng|kha| ma|hum|ne | nd|o n|lo |dzi|shu| ha|a d|o y|nda|ele|zwi|aho|ang|no | a |ela|a z|hu |sha|i n| wa|ana|hi |kan|o d|ano|a h|zwa| th| mi|gan|a l|sa |han|di |u t|and|ndi|yo |the|do |ri |vho|ni |ka |uri|si |o t|mbe|o w|ane|we |zo |i t|e n|i h|she|ush|o k|zi |da |a a|thu| la|a p|zan| i |a s|lwa|ula|i d|aka| do|mis|hed|ita|li | hu|iwa| lu|i v|he | ka|elo|so |amb|avh| sh|o v|i k|lel|u v|dzo|u s| fh|mo |nwe|o l|umi|wah|isi|hel|a i|vel|adz|tan|i m|ath|thi|wi | ur|hat|ine|le |vhe|any|a y|hon|isa|ala|o a|alu|udi|umb| bv|ash| te| li|lus|nya|has|led|swa|hus|o i|umo|one|nde|tha| it|kho|ngo|mus|hak|e y|ea |ivh|o m|u n|hin|tho|mut|ayo|fhi| sa|tel|hul|hun|ulo|ith|ma | yo|lan|e v| ph|go |i a|o u|hud| pf|uka|zhi|uvh|dzw|ing|elw|ila|wo |mbo|u d|ite|isw|asi|e k|ndu|fhe|o h|mel|u b|ika|bo |gud|dzh|kon|ifh| ta|e d|uth| ho|i z|wan|ulu|mad|inw|oth|ani|dis|wit|ou |bve|ets|u i|adi|e m|fha|nah|dal|win| si|sho| in|yam|lay|eka|a f|i u|end|i y|alo|i l|uso|mul|ta |del|u k| mb|pha| di|dad|ali|o s|pfu|khw|e a| ko| ne|hen|mas|ume|ini|ish|udz|ira|oni|luk|nel|iso|mba|dzu|hom|i s|zwo|ngu|ara|unz",
    "vi": "ng | th| ch|g t| nh|ông| kh| tr|nh | cô|côn| ty|ty |i t|n t| ng|ại | ti|ch |y l|ền | đư|hi | gở|gởi|iền|tiề|ởi | gi| le| vi|cho|ho |khá| và|hác| ph|am |hàn|ách|ôi |i n|ược|ợc | tô|chú|iệt|tôi|ên |úng|ệt | có|c t|có |hún|việ|đượ| na|g c|i c|n c|n n|t n|và |n l|n đ|àng|ác |ất |h l|nam|ân |ăm | hà| là| nă| qu| tạ|g m|năm|tại|ới | lẹ|ay |e g|h h|i v|i đ|le |lẹ |ều |ời |hân|nhi|t t| củ| mộ| về| đi|an |của|là |một|về |ành|ết |ột |ủa | bi| cá|a c|anh|các|h c|iều|m t|ện | ho|'s |ave|e's|el |g n|le'|n v|o c|rav|s t|thi|tra|vel|ận |ến | ba| cu| sa| đó| đế|c c|chu|hiề|huy|khi|nhâ|như|ong|ron|thu|thư|tro|y c|ày |đến|ười|ườn|ề v|ờng| vớ|cuộ|g đ|iết|iện|ngà|o t|u c|uộc|với|à c|ài |ơng|ươn|ải |ộc |ức | an| lậ| ra| sẽ| số| tổ|a k|biế|c n|c đ|chứ|g v|gia|gày|hán|hôn|hư |hức|i g|i h|i k|i p|iên|khô|lập|n k|ra |rên|sẽ |t c|thà|trê|tổ |u n|y t|ình|ấy |ập |ổ c| má| để|ai |c s|gườ|h v|hoa|hoạ|inh|m n|máy|n g|ngư|nhậ|o n|oa |oàn|p c|số |t đ|y v|ào |áy |ăn |đó |để |ước|ần |ển |ớc | bá| cơ| cả| cầ| họ| kỳ| li| mạ| sở| tặ| vé| vụ| đạ|a đ|bay|cơ |g s|han|hươ|i s|kỳ |m c|n m|n p|o b|oại|qua|sở |tha|thá|tặn|vào|vé |vụ |y b|àn |áng|ơ s|ầu |ật |ặng|ọc |ở t|ững| du| lu| ta| to| từ| ở |a v|ao |c v|cả |du |g l|giả",
    "xh": "la | ku|lo |nga|a k| ng|oku| kw| uk|a n|uku|ye |a i|yo |ela|ele|a u|nye|we |wa |ama|e n|ise|aba|ba |ho |enz|o n|ngo|kub|nge|ath|fun|o e|lel|ung|uba|ko |elo|ezi|o k|the|kwa|na |kwe|ang|e i|le |ka |esi|o y| na|e k|eth|pha| in|kun|nzi|and|ni |ban| ye| no|lwa|lun| ok|any|zi |li | ne|ulu|a e|eli|gok|o l|ebe|und|isa|seb|ndo| ez|tho|o i|do |ben|ing|kwi|ndl|uny|ala|a a|eyo|e u|kan| ab|thi|i k|i n|o u|o z|elw|sa |sek|ayo|het|o o|eka| um|hi |bo |so |isi|wen|lwe|aph|a l|ya |eko|ana| yo|kuf|ini|imi|ali|ha |awu|wan|ent|uth|tha|za |ula|kho| ii|ane|e a|iso|uph| le|ile|zin|nts| si|eng|nok|ong|hla|zwe| el|oka|eki|lis|azi| lo|tsh| am|ufu|ant|isw|o a|ngu|o s| ba|int|eni|une|wul|hul|sel|i e|use|lan|ke |nis|emi| li| is|iph| im|a o|aka|mfu| zi|ink|mal|ley|man|nya|nek|akh|ume| ko|alo|tu |i u|ntu|izw|kel|izi|i i|si |gan|ase|ind|i a|ndi|nel|alu|sis|ubo|kut|mth|kus|lek|mis|nde| zo| we|ani|ga |iko|siz|no |phu|e e|hon|ond|ne |ith|kul|gam|gen|pho| iz|phe|hat|khu|iin|han|zo |lu |ulo|nda|qo |zik|hel|o m| lw|zis|dle|uhl|men|olo|mel|del|nza|oko|okw|olu|kuk|nte|swa|law|enk| ya|i y|gaq|sha|aqo|e l|ikh|nkq|ule| ka|onk|thu|wo |bon|kup|qub|a y|kqu|dla| es|he |ano|lum|be |iga| ze|o w|aku|mga|nke|te | ol|ze |kum|emf|esh",
    "zu": "oku|la |nga| ng|a n| ku|a k|thi| uk|ezi|e n|uku|le |lo |hi |wa | no|a u|ela|we |a i|ni |ele|zin|uth|ama|elo|pha|ing|aba|ath|and|enz|eth|esi|ma |lel| um| ka|the|ung|nge|ngo|tho|nye|kwe|eni|izi|ye | kw|ndl|ho |a e|na |zi |het|kan|e u|e i|und|ise|isi|nda|kha|ba |i k|nom|fun| ez| iz|ke |ben|o e|isa|zwe|kel|ka |aka|nzi|o n|e k|oma|kwa| ne|any|ang|hla|i u|mth|kub|o k|ana|ane|ikh|ebe|kut|ha | is|azi|ulu|seb|ala|onk|ban|i e|azw|wen| ab|han|a a|i n|imi|lan|hat|lwa| na|ini|akh|li |ngu|nke|nok|ume|eke|elw|yo |aph|kus| es| ok|iph| im|mel|i i| lo| in| am|kho|za |gok|sek|lun|kun|lwe|sha|sik|kuf|hak|a y|thu|sa |o u|khu|ayo|hul|e a|ali|eng|lu |ne | ko|eli|uba|dle|e e|ith| yo|a l|nel|mis| si|kul|a o|sis|lok|gen|o z|i a|emi|uma|eka|alo|man|isw|tha|o i|lon|so |uph|uhl|ntu|zim|mal|ind|wez| ba|o o| yi| we|ula|phe|o y|ile|o l|wo |wel|ga |tu |hle|okw|fan| le|kaz|ase|ani|nde|bo |ngi|ule| em|men|iny|amb|mbi|gan|ifu|o s|ant|hel|ika|ona|i l|fut| fu|ze |u a|nhl|nin| zo|end|sig|u k|gab|ufa|ish|ush|kuz|no |gam|kuh| ye|nya|nez|zis|dlu|kat|dla|tsh| se|ike|kuq|gu |osi|swa|lul| zi|ima|e l|kup|mo |nza|asi|ko |kum|lek|she|umt|uny|yok|wan|wam|ame|ong|lis|mkh|ahl|ale|use|o a|alu|gap|si |hlo|nje|omt|o w|okh|he |kom|i s"
});

require.register("franc-gh-pages", function (exports, module) {
var franc = require("wooorm~franc@0.1.0");

var inputElement = document.getElementsByTagName('textarea')[0];
var outputElement = document.getElementsByTagName('ol')[0];
var buttonElement = document.getElementsByTagName('button')[0];
var wrapperElement = document.getElementsByTagName('div')[0];

buttonElement.addEventListener('click', detectLanguage);

wrapperElement.style.display = 'none';

function detectLanguage() {
    visualiseResults(franc.all(inputElement.textContent));
}

function visualiseResults(results) {
    wrapperElement.style.display = '';
    cleanOutputElement();
    results = results.map(createResult);
    
    results.forEach(function (node) {
        outputElement.appendChild(node);
    });

    results[0].classList.add('franc__probable')
}

function cleanOutputElement() {
    while (outputElement.firstElementChild) {
        outputElement.removeChild(outputElement.firstElementChild);
    }
}

function createResult(result, n) {
    var node = document.createElement('li');

    node.textContent = result[0] + ': ' + result[1];

    return node;
}
});

require("franc-gh-pages")
