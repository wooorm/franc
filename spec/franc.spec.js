'use strict';

var franc, support, assert, fixtures;

franc = require('..');
support = require('../data/support');
fixtures = require('./fixtures');
assert = require('assert');

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

    it('should return "und" on a missing value', function () {
        assert(franc() === 'und');
    });

    it('should work on weird values', function () {
        assert(franc('the the the the the ') === 'sco');
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

    it('should return [["und", 1]] on a missing value', function () {
        var result = franc.all();

        assert(result[0][0] === 'und');
        assert(result[0][1] === 1);
        assert(result[0].length === 2);
        assert(result.length === 1);
    });

    it('should work on weird values', function () {
        var result = franc.all('the the the the the ');

        assert(result[0][0] === 'sco');
        assert(result[0].length === 2);
        assert(result[1][0] === 'eng');
        assert(result[1].length === 2);
    });
});

describe('algorithm', function () {
    function classifyLanguage(input, language) {
        var example;

        example = input.replace(/\n/g, '\\n').slice(0, 20) + '...';

        describe(language.iso6393, function () {
            it('should classify `' + example + '` as ' + language.name,
                function () {
                    var result = franc(input);

                    /* istanbul ignore if */
                    if (result !== language.iso6393) {
                        console.log(franc.all(input).slice(0, 10));
                        throw new Error(
                            'Expected ' + language.iso6393 + ', ' +
                            ' got `' + result + '`'
                        )
                    }
                }
            );
        });
    }

    Object.keys(support).forEach(function (iso6393) {
        classifyLanguage(fixtures[iso6393], support[iso6393]);
    });
});
