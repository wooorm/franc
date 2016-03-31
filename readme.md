# ![franc][logo]

[![Build Status][build-badge]][build-status]
[![Coverage Status][coverage-badge]][coverage-status]
[![Code Climate][climate-badge]][climate-status]

Detect the language of text.

## What’s so cool about franc?

1.  **franc** supports more languages<sup>(†)</sup> than any other library, or Google;
2.  **franc** is easily [forked][fork] to support 339 languages;
3.  **franc** is just as fast as the competition.

† - If humans write in the language, on the web, and the language has
more than one million speakers, **franc** detects it.

## Installation

[npm][]:

```sh
npm install franc
```

**franc** is also available pre-built as an AMD, CommonJS, and globals
module, [supporting 75, 176, and 339 languages][releases].

## Usage

```javascript
var franc = require('franc');

franc('Alle menslike wesens word vry'); // "afr"
franc('এটি একটি ভাষা একক IBM স্ক্রিপ্ট'); // "ben"
franc('Alle mennesker er født frie og'); // "nno"
franc(''); // "und"

franc.all('O Brasil caiu 26 posições');
/*
 * [
 *  [ 'por', 1 ],
 *  [ 'src', 0.8948665297741273 ],
 *  [ 'glg', 0.8862422997946612 ],
 *  [ 'snn', 0.8804928131416838 ],
 *  [ 'bos', 0.8394250513347022 ],
 *  [ 'hrv', 0.8336755646817249 ],
 *  [ 'lav', 0.833264887063655 ],
 *  [ 'cat', 0.8303901437371664 ],
 *  [ 'spa', 0.8242299794661191 ],
 *  [ 'bam', 0.8242299794661191 ],
 *  [ 'sco', 0.8069815195071869 ],
 *  [ 'rmy', 0.7839835728952772 ],
 *   ...
 * ]
 */

/* "und" is returned for too-short input: */
franc('the'); // 'und'

/* You can change what’s too short (default: 10): */
franc('the', {'minLength': 3}); // 'sco'

/* Provide a whitelist: */
franc.all('O Brasil caiu 26 posições', {
    'whitelist' : ['por', 'src', 'glg', 'spa']
});
/*
 * [
 *   [ 'por', 1 ],
 *   [ 'src', 0.8948665297741273 ],
 *   [ 'glg', 0.8862422997946612 ],
 *   [ 'spa', 0.8242299794661191 ]
 * ]
*/

/* Provide a blacklist: */
franc.all('O Brasil caiu 26 posições', {
    'blacklist' : ['src', 'glg', 'lav']
});
/*
 * [
 *   [ 'por', 1 ],
 *   [ 'snn', 0.8804928131416838 ],
 *   [ 'bos', 0.8394250513347022 ],
 *   [ 'hrv', 0.8336755646817249 ],
 *   [ 'cat', 0.8303901437371664 ],
 *   [ 'spa', 0.8242299794661191 ],
 *   [ 'bam', 0.8242299794661191 ],
 *   [ 'sco', 0.8069815195071869 ],
 *   [ 'rmy', 0.7839835728952772 ],
 *   ...
 * ]
 */
```

## CLI

Install:

```bash
npm install --global franc
```

Use:

```text
Usage: franc [options] <string>

Detect the language of text

Options:

  -h, --help                    output usage information
  -v, --version                 output version number
  -m, --min-length <number>     minimum length to accept
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
$ franc --blacklist por,glg "O Brasil caiu 26 posições"
# src

# output language from stdin with whitelist
$ echo "Alle mennesker er født frie og" | franc --whitelist nob,dan
# nob
```

## Supported languages

**franc** supports 176 “languages”, by default. For a complete list,
check out [supported-languages.md][support].

## Supporting more or less languages

Supporting more or less languages is easy: fork the project and run
the following:

```bash
npm install # Install development dependencies.
export THRESHOLD=100000 # Set minimum speakers to a 100,000.
npm run build # Run the `build` script.
```

The above would create a version of **franc** with support for any
language with 100,000 or more speakers. To support all languages, even
dead ones like Latin, specify `-1`.

## Browser

I’ve compiled three versions of **franc** for use in the browser.
They’re [UMD][] compliant: they work with [AMD][], [CommonJS][], and
`<script>`s.

*   `franc.js` — **franc** with support for languages with 8 million or
    more speakers (75 languages);

*   `franc-most.js` — **franc** with support for languages with 1
    million or more speakers (175 languages, the same as the npm
    version);

*   `franc-all.js` — **franc** with support for all languages (339
    languages, carful, huge!).

## Derivation

Franc is a derivative work from [guess-language][] (Python, LGPL),
[guesslanguage][] (C++, LGPL), and [Language::Guess][language-guess]
(Perl, GPL). Their creators granted me the rights to distribute franc
under the MIT license: respectively, [Maciej Ceglowski][grant-1],
[Jacob R. Rideout][grant-2], and [Kent S. Johnson][grant-3].

## License

[MIT][] © [Titus Wormer][home]

<!-- Definitions -->

[releases]: https://github.com/wooorm/franc/releases

[logo]: https://cdn.rawgit.com/wooorm/franc/master/logo.svg

[build-badge]: https://img.shields.io/travis/wooorm/franc.svg

[build-status]: https://travis-ci.org/wooorm/franc

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/franc.svg

[coverage-status]: https://codecov.io/github/wooorm/franc

[climate-badge]: http://img.shields.io/codeclimate/github/wooorm/franc.svg

[climate-status]: https://codeclimate.com/github/wooorm/franc

[fork]: #supporting-more-or-less-languages

[npm]: https://docs.npmjs.com/cli/install

[support]: supported-languages.md

[umd]: http://ryanflorence.com/2013/es6-modules-and-browser-app-delivery/

[amd]: https://github.com/amdjs/amdjs-api/blob/master/AMD.md

[commonjs]: http://www.commonjs.org

[guess-language]: http://code.google.com/p/guess-language/

[guesslanguage]: http://websvn.kde.org/branches/work/sonnet-refactoring/common/nlp/guesslanguage.cpp?view=markup

[language-guess]: http://web.archive.org/web/20090228163219/http://languid.cantbedone.org/

[grant-1]: https://github.com/wooorm/franc/issues/6#issuecomment-59669191

[grant-2]: https://github.com/wooorm/franc/issues/6#issuecomment-60196819

[grant-3]: https://github.com/wooorm/franc/issues/6#issuecomment-59936827

[mit]: LICENSE

[home]: http://wooorm.com
