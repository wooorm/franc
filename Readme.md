# franc [![Build Status](https://travis-ci.org/wooorm/franc.svg?branch=master)](https://travis-ci.org/wooorm/franc) [![Coverage Status](https://img.shields.io/coveralls/wooorm/franc.svg)](https://coveralls.io/r/wooorm/franc?branch=master)

Detect the language of text.

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
franc('Alle mennesker er født frie og'); // "nob"
franc(''); // "und"

franc.all('O Brasil caiu 26 posições em');
/*
 * [
 *   [ 'por', 5507 ],
 *   [ 'lat', 6384 ],
 *   [ 'lav', 6391 ],
 *   [ 'cat', 6432 ],
 *   [ 'spa', 6481 ]
 *   ...
 * ]
 */

franc.all(''); // [ [ 'und', 1 ] ]
```

> Note!: **franc** returns the `"und"` language code for an undetermined language. This happens when the input value is too short to give a significant answer.

## Supported languages

**franc** supports 82 languages. For a complete list, check out [Supported-Languages.md](Supported-Languages.md).

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

On a MacBook Air, it runs 82 tests, 10 times per second (total: 820 op/s).

```
         benchmarks * 82 paragraphs in different languages
  10 op/s » franc -- this module
   6 op/s » guesslanguage
   4 op/s » languagedetect
   5 op/s » vac
```

## License

LGPL © Titus Wormer
