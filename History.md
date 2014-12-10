
n.n.n / 2014-12-10
==================

 * Merge branch 'feature/add-browser-version'
 * Update docs for browser versions
 * Add browser-globals and browser-amd tests
 * Add browser versions; add browser generation to build

0.6.2 / 2014-12-01
==================

 * Update markdown-table
 * Add explicit mention of stdin encoding to CLI

0.6.1 / 2014-11-29
==================

 * Add CLI description to `Readme.md`

0.6.0 / 2014-11-29
==================

 * Merge branch 'feature/add-cli'
 * Add CLI test
 * Add CLI
 * Add `cli.js`
 * Update keywords in `bower.json`, `component.json`, `package.json`
 * Add link to personal website in `Readme.md`
 * Update eslint

0.5.1 / 2014-11-19
==================

 * Add `logo.svg`
 * Update matcha
 * Fix incorrect executive file rights

0.5.0 / 2014-11-09
==================

 * Update example build-process in `Readme.md`
 * Update example output in `Readme.md` for changes in 8b339ad
 * Add explicit mention of maximum supported languages to `Readme.md`
 * Merge branch 'feature/add-build-cli'
 * Update docs for new build CLI
 * Fix typo in `build-languages`
 * Remove support for `cbs`, `prq`
 * Add support for languages without fixtures
 * Add longer fixtures when franc supports 200+ languages
 * Fix multi-script languages with few divergent characters
 * Add custom fixtures for `gug`, `gyr`, `eve`
 * Add option to set threshold through an ENV variable
 * Add debug statements with language names
 * Add test for valid iso-639-3 code
 * Merge branch 'feature/normalize-results'
 * Add test for normalized distances
 * Add normalized distances to `all` results

0.4.1 / 2014-11-08
==================

 * Refactor benchmark
 * Refactor property sorting in `bower.json`, `package.json`
 * Refactor `.gitignore`, `.npmignore`, bower ignore sorting
 * Remove `before_install` travis target
 * Refactor npm script target order in `package.json`
 * Add flat badges to `Readme.md`
 * Add `lib/expressions.js` to `lint-api` target
 * Add `.eslintrc`
 * Fix scripts for new eslint rules
 * Refactor to disallow space after object keys
 * Update eslint, markdown-table, trigrams

0.4.0 / 2014-10-23
==================

 * Update license from LGPL to MIT
 * Update mocha, speakers, udhr, trigram-utils

0.3.0 / 2014-10-16
==================

 * Merge branch 'feature/add-white-and-black-list'
 * Refactor tests
 * Refactor comment line-wrap in API
 * Refactor API
 * Remove competition from Readme.md
 * Move description of undefined languages in Readme.md
 * Refactor code-style in useage example in Readme.md
 * Merge branch 'kamilbielawski-languages_whitelist_and_blacklist' into feature/add-white-and-black-list
 * Update Readme
 * Add tests for whitelist and blacklist
 * Filter languages by whitelist and/or blacklist

0.2.3 / 2014-10-11
==================

 * Refactor bower ignore
 * Refactor .jscs.json
 * Refactor .gitignore
 * Update .npmignore
 * Refactor benchmark
 * Move benchmark/ to benchmark.js
 * Move spec/ to test/
 * Add support for multi-script languages

0.2.2 / 2014-10-05
==================

 * Fix strict version range of trigram-utils in component.json
 * Remove lib/singletons.js from component
 * Remove extraneous comments in scripts
 * Add markdown-table as a dependency
 * Fix a bug where Japanese was stored without script information
 * Merge branch 'feature/loosen-unique-script-margin'
 * Fix multi-language unique script support
 * Update trigrams, udhr
 * Remove langs from dev-dependencies

0.2.1 / 2014-10-03
==================

 * Update speakers to 0.0.2
 * Merge pull request #7 from jeffhuys/master
 * Spelling fix
 * Add link in Readme.md on how to fork franc for more supported languages

0.2.0 / 2014-10-02
==================

 * Add code-climate badge to Readme.md
 * Fix incorrectly removed benchmark-install script in f8340cf
 * Refactor benchmark
 * Update .gitignore, .npmignore, bower.json
 * Remove browser test
 * Remove testling
 * Merge branch 'feature/add-more-languages'
 * Update benchmark results in Readme.md
 * Refactor benchmark for new variable support
 * Update component.json whitelist
 * Update bower.json ignore list
 * Refactor npm script targets
 * Refactor Supported-Languages generation
 * Refactor API to work with recent changes
 * Remove language name from iso6393 script
 * Fix spec for recent changes
 * Fix generation of fixtures
 * Fix generation of trigrams; Add JSON generation of support
 * Remove build-data script
 * Add  custom fixtures as JS instead of JSON and add sat
 * Move generated data to lib
 * Remove previous support files
 * Remove previous data file
 * Move generated singletons and expressions to lib
 * Add automatic trigram and unique-script generation
 * Add speakers, unicode as dependencies
 * Remove dot-notation style limitation
 * Add support for `Assyrian Neo-Aramaic`
 * Add support for `Dangme`
 * Add support for `Aceh`

0.2.0-rc.2 / 2014-09-30
==================

 * Update Readme.md and benchmark for recent changes
 * Update spec for b8bb1a6
 * Refactor API to return ISO-639-3 codes instead of 639-2
 * Add generation of ISO-639-3 codes, remove 639-2 support
 * Add ISO-639-3 names file, remove ISO-639-2 names file

0.2.0-rc.1 / 2014-09-30
==================

 * Update Supported-Languages.md for recent changes
 * Update spec for recent API changes
 * Remove support for three languages
 * Update bower.json, component.json for recent directory refactor
 * Update fixtures
 * Update data to new and current trigrams
 * Move ISO codes to data directory
 * Add Portuguese to ISO codes
 * Update npm scripts to lint new files, handle renames
 * Update fixture generation script
 * Add trigram generation script
 * Add mapping between ISO and UDHR keys
 * Add trigrams and udhr as dev-dependencies
 * Move scrips and API files
 * Remove fixtures

0.1.1 / 2014-09-19
==================

 * Update docs
 * Refactor api
 * Refactor API to use trigram-utils
 * Add trigram-utils to dependencies
 * Fix indentation in component.json
 * Fix .npmignore, update .gitignore
 * Add Bower to Installation in docs
 * Add bower.json
 * Update eslint, broaden mocha version range

0.1.0 / 2014-07-21
==================

 * Rewrote data.json to be much smaller, half its gziped weight (fixes #3)
 * Fixed incorrectly styled list (fixes #2)
 * Add explanation of the "und" language code (fixes #1)

0.0.2 / 2014-07-19
==================

 * Fixed JSON loading in component
 * Fixed typo in license
