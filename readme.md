# ![franc][logo]

[![Build Status][build-badge]][build-status]
[![Coverage Status][coverage-badge]][coverage-status]

Detect the language of text.

## What’s so cool about franc?

1.  **franc** can support more languages<sup>(†)</sup> than any other
    library
2.  **franc** is packaged with support for [82][s], [187][m], or [406][l]
    languages
3.  **franc** has a CLI

† - Based on the [UDHR][], the most translated document in the world.

## What’s not so cool about franc?

**franc** supports many languages, which means it’s easily confused on small
samples.
Make sure to pass it big documents to get reliable results.

## Install

[npm][]:

```sh
npm install franc
```

This installs the [`franc`][m] package, with support for 187 languages
(languages which have 1 million or more speakers).
[`franc-min`][s] (82 languages, 8m or more speakers) and [`franc-all`][l] (all
406 possible languages) are also available.
Finally, use `franc-cli` to install the [CLI][].

Browser builds for [`franc-min`][s], [`franc`][m], and [`franc-all`][l] are
available on [GitHub Releases][releases].

## Use

```js
var franc = require('franc')

franc('Alle menslike wesens word vry') // => 'afr'
franc('এটি একটি ভাষা একক IBM স্ক্রিপ্ট') // => 'ben'
franc('Alle menneske er fødde til fridom') // => 'nno'

franc('') // => 'und' (language code that stands for undetermined)

// You can change what’s too short (default: 10):
franc('the') // => 'und'
franc('the', {minLength: 3}) // => 'sco'
```

###### `.all`

```js
console.log(franc.all('O Brasil caiu 26 posições'))
```

Yields:

```js
[ [ 'por', 1 ],
  [ 'src', 0.8797557538750587 ],
  [ 'glg', 0.8708313762329732 ],
  [ 'snn', 0.8633161108501644 ],
  [ 'bos', 0.8172851103804604 ],
  ... 116 more items ]
```

###### `only`

```js
console.log(franc.all('O Brasil caiu 26 posições', {only: ['por', 'spa']}))
```

Yields:

```js
[ [ 'por', 1 ], [ 'spa', 0.799906059182715 ] ]
```

###### `ignore`

```js
console.log(franc.all('O Brasil caiu 26 posições', {ignore: ['src', 'glg']}))
```

Yields:

```js
[ [ 'por', 1 ],
  [ 'snn', 0.8633161108501644 ],
  [ 'bos', 0.8172851103804604 ],
  [ 'hrv', 0.8107092531705026 ],
  [ 'lav', 0.810239549084077 ],
  ... 114 more items ]
```

## CLI

Install:

```sh
npm install franc-cli --global
```

Use:

```text
CLI to detect the language of text

Usage: franc [options] <string>

Options:

  -h, --help                    output usage information
  -v, --version                 output version number
  -m, --min-length <number>     minimum length to accept
  -o, --only <string>           allow languages
  -i, --ignore <string>         disallow languages
  -a, --all                     display all guesses

Usage:

# output language
$ franc "Alle menslike wesens word vry"
# afr

# output language from stdin (expects utf8)
$ echo "এটি একটি ভাষা একক IBM স্ক্রিপ্ট" | franc
# ben

# ignore certain languages
$ franc --ignore por,glg "O Brasil caiu 26 posições"
# src

# output language from stdin with only
$ echo "Alle mennesker er født frie og" | franc --only nob,dan
# nob
```

## Supported languages

| Package | Languages | Speakers |
| - | - | - |
| [`franc-min`][s] | 82 | 8M or more |
| [`franc`][m] | 187 | 1M or more |
| [`franc-all`][l] | 406 | - |

### Language code

Note that franc returns [ISO 639-3][iso6393] codes (three letter codes).
**Not** ISO 639-1 or ISO 639-2.
See also [GH-10][] and [GH-30][].

To get more info about the languages represented by ISO 639-3, use
[`iso-639-3`][iso-639-3].
There is also an index available to map ISO 639-3 to ISO 639-1 codes,
[`iso-639-3/to-1.json`][iso-639-3-to-1], but note that not all 639-3 codes can
be represented in 639-1.

## Ports

Franc has been ported to several other programming languages.

*   Elixir — [`paasaa`](https://github.com/minibikini/paasaa)
*   Erlang — [`efranc`](https://github.com/G-Corp/efranc)
*   Go — [`franco`](https://github.com/kapsteur/franco),
    [`whatlanggo`](https://github.com/abadojack/whatlanggo)
*   R — [`franc`](https://github.com/MangoTheCat/franc)
*   Rust — [`whatlang-rs`](https://github.com/greyblake/whatlang-rs)

The works franc is derived from have themselves also been ported to other
languages.

## Derivation

Franc is a derivative work from [guess-language][] (Python, LGPL),
[guesslanguage][] (C++, LGPL), and [Language::Guess][language-guess]
(Perl, GPL).
Their creators granted me the rights to distribute franc under the MIT license:
respectively, [Kent S. Johnson][grant-3], [Jacob R. Rideout][grant-2], and
[Maciej Ceglowski][grant-1].

## License

[MIT][] © [Titus Wormer][home]

<!-- Definitions -->

[releases]: https://github.com/wooorm/franc/releases

[logo]: https://raw.githubusercontent.com/wooorm/franc/a162cc0/logo.svg?sanitize=true

[build-badge]: https://img.shields.io/travis/wooorm/franc.svg

[build-status]: https://travis-ci.org/wooorm/franc

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/franc.svg

[coverage-status]: https://codecov.io/github/wooorm/franc

[npm]: https://docs.npmjs.com/cli/install

[guess-language]: https://github.com/kent37/guess-language

[guesslanguage]: http://websvn.kde.org/branches/work/sonnet-refactoring/common/nlp/guesslanguage.cpp?view=markup

[language-guess]: http://web.archive.org/web/20090228163219/http://languid.cantbedone.org/

[grant-1]: https://github.com/wooorm/franc/issues/6#issuecomment-59669191

[grant-2]: https://github.com/wooorm/franc/issues/6#issuecomment-60196819

[grant-3]: https://github.com/wooorm/franc/issues/6#issuecomment-59936827

[mit]: license

[home]: http://wooorm.com

[cli]: #cli

[udhr]: http://unicode.org/udhr/

[s]: https://github.com/wooorm/franc/tree/main/packages/franc-min

[m]: https://github.com/wooorm/franc/tree/main/packages/franc

[l]: https://github.com/wooorm/franc/tree/main/packages/franc-all

[iso6393]: https://iso639-3.sil.org/code_tables/639/data

[gh-10]: https://github.com/wooorm/franc/issues/10

[gh-30]: https://github.com/wooorm/franc/issues/30

[iso-639-3]: https://github.com/wooorm/iso-639-3

[iso-639-3-to-1]: https://github.com/wooorm/iso-639-3/blob/HEAD/to-1.json
