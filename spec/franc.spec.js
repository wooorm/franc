'use strict';

var franc, data, assert, fixtures, namedLanguages;

franc = require('..');
data = require('../lib/data.json');
fixtures = require('./fixtures.json');
assert = require('assert');
namedLanguages = require('../data/iso-639-2-languages.json');

describe('franc()', function () {
    it('should be of type `function`', function () {
        assert(typeof franc === 'function');
    });

    it('should return a string', function () {
        assert(typeof franc('XYZ') === 'string');
    });

    it('should return "und" on an undetermined value', function () {
        assert(franc('XYZ') === 'und');
    });

    it('should work on weird values', function () {
        assert(franc('the the the the the ') === 'en');
    });
});

describe('franc.all()', function () {
    it('should be of type `function`', function () {
        assert(typeof franc.all === 'function');
    });

    it('should return an array containing language--probability tuples',
        function () {
            var result = franc.all('XYZ');

            assert(result instanceof Array);
            assert(typeof result[0][0] === 'string');
            assert(typeof result[0][1] === 'number');
        }
    );

    it('should return [["und", 1]] on an undetermined value', function () {
        var result = franc.all('XYZ');

        assert(result[0][0] === 'und');
        assert(result[0][1] === 1);
        assert(result[0].length === 2);
        assert(result.length === 1);
    });

    it('should work on weird values', function () {
        var result = franc.all('the the the the the ');

        assert(result[0][0] === 'en');
        assert(result[0].length === 2);
    });
});

describe('algorithm', function () {
    var language;

    function classifyLanguage(input, output) {
        var namedLanguage = namedLanguages[output];

        it('should classify `' + input + '` as `' + output + '` (' +
            namedLanguage + ')',
            function () {
                var result = franc(input);
                /* istanbul ignore if */
                if (result !== output) {
                    throw new Error(
                        'Expected ' + output + ', but got `' + result + '`'
                    )
                }
            }
        );
    }

    for (language in fixtures) {
        classifyLanguage(fixtures[language], language);
    }
});

describe('Unit tests', function () {
    var languages;

    // All key-ed trigrams
    languages = Object.keys(data);

    // All singletons;
    languages = languages.concat(
        'hy|he|bn|pa|el|gu|or|ta|te|kn|ml|si|th|lo|bo|my|ka|mn|km'.split('|')
    );

    languages.forEach(function (language) {
        var namedLanguage = namedLanguages[language];

        it('should have a fixture for `' + language + '` (' + namedLanguage +
            ')', function () {
                assert.doesNotThrow(function () {
                    /* istanbul ignore else */
                    if (language in fixtures) {
                        return;
                    }

                    /* istanbul ignore next */
                    throw new Error(
                        'Unit tests should cover `' + language + '`'
                    );
                });
            }
        );
    });
});
