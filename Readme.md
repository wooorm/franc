# ![franc](http://wooorm.com/franc.png)

[![Build Status](https://travis-ci.org/wooorm/franc.svg?branch=master)](https://travis-ci.org/wooorm/franc) [![Coverage Status](https://img.shields.io/coveralls/wooorm/franc.svg)](https://coveralls.io/r/wooorm/franc?branch=master) [![Code Climate](http://img.shields.io/codeclimate/github/wooorm/franc.svg)](https://codeclimate.com/github/wooorm/franc)

Detect the language of text.

# What’s so cool about franc?

1. **franc** supports more languages<sup>(†)</sup> than any other library, or Google;
2. **franc** is easily [forked](https://github.com/wooorm/franc/blob/master/script/build-languages.js#L36) to support 300+ languages;
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

// You can provide whitelist and/or blackilist to speed things up:
franc.all('O Brasil caiu 26 posições em', {whitelist: ['por', 'src', 'glg', 'spa']});
/*
 * [
 *   [ 'por', 5507 ],
 *   [ 'glg', 6270 ],
 *   [ 'src', 6292 ],
 *   [ 'spa', 6481 ]
 * ]
*/

franc.all('O Brasil caiu 26 posições em', {blacklist: ['src', 'glg', 'lav']});
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

franc.all(''); // [ [ 'und', 1 ] ]


```

> Note!: **franc** returns the `"und"` language code for an undetermined language. This happens when the input value is too short to give a significant answer.

## Supported languages

**franc** supports 175 “languages”. For a complete list, check out [Supported-Languages.md](Supported-Languages.md).

## Other Language detection libraries

- [richtr/guessLanguage.js](https://github.com/richtr/guessLanguage.js);
- [FGRibreau/node-language-detect](https://github.com/FGRibreau/node-language-detect);
- [Legify/vac](https://github.com/Legify/vac).

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

## License

LGPL © Titus Wormer
