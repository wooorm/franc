# franc [![Build Status](https://travis-ci.org/wooorm/franc.svg?branch=master)](https://travis-ci.org/wooorm/franc) [![Coverage Status](https://img.shields.io/coveralls/wooorm/franc.svg)](https://coveralls.io/r/wooorm/franc?branch=master)

Detect the language of text.

## Installation

NPM:
```sh
$ npm install franc
```

Component.js:
```sh
$ component install wooorm/franc
```

## Usage

```js
var franc = require('franc');

franc('Alle menslike wesens word vry'); // "af"
franc('এটি একটি ভাষা একক IBM স্ক্রিপ্ট'); // "bn"
franc('Alle mennesker er født frie og'); // "no"
franc(''); // "und"

franc.all('O Brasil caiu 26 posições em'); /*
 * [
 *   [ 'pt-BR', 5242 ],
 *   [ 'pt-PT', 7293 ],
 *   [ 'pt', 6181 ],
 *   [ 'ca', 6991 ],
 *   [ 'es', 7074 ],
 *   ...
 * ]
 */

franc.all('Heghlu\'meH QaQ jajvam').slice(0, 3); /*
 * [
 *   [ 'tlh', 4624 ], // 'eH, tlhIngan, 'e' H*'t*gh QaQ!
 *   [ 'az', 5929 ],
 *   [ 'lv', 6084 ]
 * ]
 */
franc.all(''); // [ [ 'und', 1 ] ]
```

**Note!** Franc returns the `"und"` language code for an undetermined language. this happens when the input value is to short to give a significant answer.

## Supported languages

franc supports 86 languages. For a complete list, check out [Supported-Languages.md](Supported-Languages.md).

## Other Language detection libraries

- [richtr/guessLanguage.js](https://github.com/richtr/guessLanguage.js) — Just as fast, contains a few bugs, not really maintained;
- [FGRibreau/node-language-detect](https://github.com/FGRibreau/node-language-detect) — Supports less languages, slower.
- [Legify/vac](https://github.com/FGRibreau/Legify/vac) — Supports less languages, slower.

## Benchmark

Run the benchmark yourself:

```sh
$ npm run install-benchmark # Just once of course.
$ npm run benchmark
```

On a MacBook Air, it runs 86 tests, 8 times per second (total: 602 op/s).

```
         benchmarks * 86 paragraphs in different languages
  8 op/s » franc -- this module
  5 op/s » guesslanguage
  4 op/s » languagedetect
  5 op/s » vac
```

## License

  LGPL
