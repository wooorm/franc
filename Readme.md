# ![franc](https://cdn.rawgit.com/wooorm/franc/master/logo.svg)

[![Build Status](https://img.shields.io/travis/wooorm/franc.svg?style=flat)](https://travis-ci.org/wooorm/franc) [![Coverage Status](https://img.shields.io/coveralls/wooorm/franc.svg?style=flat)](https://coveralls.io/r/wooorm/franc?branch=master) [![Code Climate](http://img.shields.io/codeclimate/github/wooorm/franc.svg?style=flat)](https://codeclimate.com/github/wooorm/franc)

Detect the language of text.

# What’s so cool about franc?

1. **franc** supports more languages<sup>(†)</sup> than any other library, or Google;
2. **franc** is easily [forked](#supporting-more-or-less-languages) to support 335 languages;
3. **franc** is just as fast as the competition.

† - If humans write in the language, on the web, and the language has more than one million speakers, **franc** detects it.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install franc
```

[Component.js](https://github.com/componentjs/component):

```bash
$ component install wooorm/franc
```

[Bower](http://bower.io/#install-packages):

```bash
$ bower install franc
```

[Duo](http://duojs.org/#getting-started):

```javascript
var franc = require('wooorm/franc');
```

[AMD](http://requirejs.org/docs/whyamd.html#amd) ([info](#browser)):

```javascript
require(['path/to/dist/franc.js'], function (franc) {
    franc('Alle menslike wesens word vry'); // "afr"
});
```

Browser globals ([info](#browser)):

```html
<script src="path/to/dist/franc.js" charset="utf-8"></script>
<script>
    franc('Alle menslike wesens word vry'); // "afr"
</script>
```

## Usage

```javascript
var franc = require('franc');

franc('Alle menslike wesens word vry'); // "afr"
franc('এটি একটি ভাষা একক IBM স্ক্রিপ্ট'); // "ben"
franc('Alle mennesker er født frie og'); // "nno"
franc(''); // "und"

franc.all('O Brasil caiu 26 posições em');
/*
 * [
 *   [ 'por', 1 ],
 *   [ 'glg', 0.7362599377808503 ],
 *   [ 'src', 0.7286553750432078 ],
 *   [ 'lav', 0.6944348427238161 ],
 *   [ 'cat', 0.6802627030763913 ],
 *   [ 'spa', 0.6633252678880055 ],
 *   [ 'bos', 0.6536467334946423 ],
 *   [ 'tpi', 0.6477704804701002 ],
 *   [ 'hrv', 0.6456965088143796 ],
 *   [ 'snn', 0.6374006221914967 ],
 *   [ 'bam', 0.5900449360525406 ],
 *   [ 'sco', 0.5893536121673004 ],
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
 *   [ 'por', 1 ],
 *   [ 'glg', 0.7362599377808503 ],
 *   [ 'src', 0.7286553750432078 ],
 *   [ 'spa', 0.6633252678880055 ]
 * ]
*/

/* Provide a blacklist: */
franc.all('O Brasil caiu 26 posições em', {
    'blacklist' : ['src', 'glg', 'lav']
});
/*
 * [
 *   [ 'por', 1 ],
 *   [ 'cat', 0.6802627030763913 ],
 *   [ 'spa', 0.6633252678880055 ],
 *   [ 'bos', 0.6536467334946423 ],
 *   [ 'tpi', 0.6477704804701002 ],
 *   [ 'hrv', 0.6456965088143796 ],
 *   [ 'snn', 0.6374006221914967 ],
 *   [ 'bam', 0.5900449360525406 ],
 *   [ 'sco', 0.5893536121673004 ],
 *   ...
 * ]
 */
```

## CLI

Install:

```bash
$ npm install --global franc
```

Use:

```text
Usage: franc [options] <string>

Detect the language of text

Options:

  -h, --help                    output usage information
  -v, --version                 output version number
  -w, --whitelist <string>      allow languages
  -b, --blacklist <string>      disallow languages

Usage:

# output language
$ franc "Alle menslike wesens word vry"
# afr

# output language from stdin (expects utf8)
$ echo "এটি একটি ভাষা একক IBM স্ক্রিপ্ট" | franc
# ben

# blacklist certain languages
$ franc --blacklist por,glg "O Brasil caiu 26 posições em"
# src

# output language from stdin with whitelist
$ echo "Alle mennesker er født frie og" | franc --whitelist nob,dan
# nob
```

## Supported languages

**franc** supports 175 “languages”. For a complete list, check out [Supported-Languages.md](Supported-Languages.md).

## Supporting more or less languages

Supporting more or less languages is easy: fork the project and run the following:

```bash
$ npm install # Install development dependencies.
$ export THRESHOLD=100000 # Set minimum speakers to a 100,000.
$ npm run build # Run the `build` script.
```

The above would create a version of **franc** with support for any language with 100,000 or more speakers. To support all languages, even dead ones like Latin, specify `-1`.

## Browser

I’ve compiled three versions of **franc** for use in the browser. They’re [UMD](http://ryanflorence.com/2013/es6-modules-and-browser-app-delivery/) compliant: they work with [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md), [CommonJS](http://www.commonjs.org), and `<script>`s.

- [dist/franc.js](dist/franc.js) — **franc** with support for languages with 8 million or more speakers (75 languages);
- [dist/franc-most.js](dist/franc-most.js) — **franc** with support for languages with 1 million or more speakers (175 languages, the same as the [Node or Component](Supported-Languages.md) version);
- [dist/franc-all.js](dist/franc-all.js) — **franc** with support for all languages (335 languages, carful, huge!).

## Benchmark

On a MacBook Air, it runs 175 paragraphs 2 times per second (total: 350 op/s).

```text
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

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
