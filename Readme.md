# ![franc](http://wooorm.com/franc.png)

[![Build Status](https://img.shields.io/travis/wooorm/franc.svg?style=flat)](https://travis-ci.org/wooorm/franc) [![Coverage Status](https://img.shields.io/coveralls/wooorm/franc.svg?style=flat)](https://coveralls.io/r/wooorm/franc?branch=master) [![Code Climate](http://img.shields.io/codeclimate/github/wooorm/franc.svg?style=flat)](https://codeclimate.com/github/wooorm/franc)

Detect the language of text.

# What’s so cool about franc?

1. **franc** supports more languages<sup>(†)</sup> than any other library, or Google;
2. **franc** is easily [forked](#supporting-more-or-less-languages) to support 300+ languages;
3. **franc** is just as fast as the competition.

† - If humans write in the language, on the web, and the language has more than one million speakers, **franc** detects it.

## Installation

npm:
```sh
$ npm install franc
```

Component:
```sh
$ component install wooorm/franc
```

Bower:
```sh
$ bower install franc
```

## Usage

```js
var franc = require('franc');

franc('Alle menslike wesens word vry'); // "afr"
franc('এটি একটি ভাষা একক IBM স্ক্রিপ্ট'); // "ben"
franc('Alle mennesker er født frie og'); // "nno"
franc(''); // "und"

franc.all('O Brasil caiu 26 posições em');
/*
 * [
 *   [ 'por', 5507 ],
 *   [ 'glg', 6270 ],
 *   [ 'src', 6292 ],
 *   [ 'lav', 6391 ],
 *   [ 'cat', 6432 ],
 *   [ 'spa', 6481 ],
 *   [ 'bos', 6509 ],
 *   [ 'tpi', 6526 ],
 *   [ 'hrv', 6532 ],
 *   [ 'snn', 6556 ],
 *   [ 'bam', 6693 ],
 *   [ 'sco', 6695 ],
 *   ...
 * ]
 */

/* "und" is returned for too-short input: */
franc.all(''); // [ [ 'und', 1 ] ]

/* Provide a whitelist: */
franc.all('O Brasil caiu 26 posições em', {
    'whitelist' : ['por', 'src', 'glg', 'spa']
});
/*
 * [
 *   [ 'por', 5507 ],
 *   [ 'glg', 6270 ],
 *   [ 'src', 6292 ],
 *   [ 'spa', 6481 ]
 * ]
*/

/* Provide a blacklist: */
franc.all('O Brasil caiu 26 posições em', {
    'blacklist' : ['src', 'glg', 'lav']
});
/*
 * [
 *   [ 'por', 5507 ],
 *   [ 'cat', 6432 ],
 *   [ 'spa', 6481 ],
 *   [ 'bos', 6509 ],
 *   [ 'tpi', 6526 ],
 *   [ 'hrv', 6532 ],
 *   [ 'snn', 6556 ],
 *   [ 'bam', 6693 ],
 *   [ 'sco', 6695 ],
 *   ...
 * ]
 */
```

## Supported languages

**franc** supports 175 “languages”. For a complete list, check out [Supported-Languages.md](Supported-Languages.md).

## Supporting more or less languages

Supporting more or less languages is easy: fork the project and run the following:

```sh
$ npm install
$ THRESHOLD=-1 npm run build
```

## Benchmark

On a MacBook Air, it runs 175 paragraphs 2 times per second (total: 350 op/s).

```
         benchmarks * 175 paragraphs in different languages
  2 op/s » franc -- this module
  2 op/s » guesslanguage
  2 op/s » languagedetect
  2 op/s » vac
```

(I’ll work on a better benchmark soon)

## Derivation

Franc is a derivative work from [guess-language](http://code.google.com/p/guess-language/) (Python, LGPL), [guesslanguage](http://websvn.kde.org/branches/work/sonnet-refactoring/common/nlp/guesslanguage.cpp?view=markup) (C++, LGPL), and [Language::Guess](http://web.archive.org/web/20090228163219/http://languid.cantbedone.org/) (Perl, GPL). Their creators granted me the rights to distribute franc under the MIT license: respectively, [Maciej Ceglowski](https://github.com/wooorm/franc/issues/6#issuecomment-59669191), [Jacob R. Rideout](https://github.com/wooorm/franc/issues/6#issuecomment-60196819), and [Kent S. Johnson](https://github.com/wooorm/franc/issues/6#issuecomment-59936827).

## License

MIT © Titus Wormer
