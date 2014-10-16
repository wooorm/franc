'use strict';

/**
 * Dependencies.
 */

var franc,
    assert,
    support,
    fixtures;

franc = require('..');
assert = require('assert');
support = require('../data/support');
fixtures = require('./fixtures');

/**
 * Constants;
 */

var MAGIC_NUMBER,
    MAGIC_LANGUAGE;

MAGIC_NUMBER = 42;

MAGIC_LANGUAGE = 'pol';

/**
 * The fixture belonging to magic number should not equal
 * magic language.
 */

assert(MAGIC_LANGUAGE !== franc(fixtures[MAGIC_NUMBER]));

/**
 * Tests.
 */

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

    /**
     * Inspired by lifthrasiir on hackernews:
     *
     *   https://news.ycombinator.com/item?id=8405672
     */

    it('should work on unique-scripts with many latin characters',
        function () {
            var fixture;

            fixture = '한국어 문서가 전 세계 웹에서 차지하는 비중은 2004년에 4.1%로, ' +
                '이는 영어(35.8%), 중국어(14.1%), 일본어(9.6%), 스페인어(9%), ' +
                '독일어(7%)에 이어 전 세계 6위이다. 한글 문서와 한국어 문서를 같은' +
                '것으로 볼 때, 웹상에서의 한국어 사용 인구는 전 세계 69억여 명의 인구 ' +
                '중 약 1%에 해당한다.';

            assert(franc(fixture) === 'kor');

            fixture = '現行の学校文法では、英語にあるような「目的語」「補語」' +
                'などの成分はないとする。英語文法では "I read a book." の ' +
                '"a book" はSVO文型の一部をなす目的語であり、また、"I go to ' +
                'the library." の "the library" ' +
                'は前置詞とともに付け加えられた修飾語と考えられる。';

            assert(franc(fixture) === 'jpn');
        }
    );

    it('should accept blacklist parameter', function () {
        var language,
            result;

        language = franc(fixtures[MAGIC_NUMBER]);

        result = franc(fixtures[MAGIC_NUMBER], {
            'blacklist' : [language]
        });

        assert(result !== language);
    });

    it('should accept whitelist parameter', function () {
        var result;

        result = franc(fixtures[MAGIC_NUMBER], {
            'whitelist' : [MAGIC_LANGUAGE]
        });

        assert(result === MAGIC_LANGUAGE);
    });
});
describe('franc.all()', function () {
    it('should be of type `function`', function () {
        assert(typeof franc.all === 'function');
    });

    it('should return an array containing language--probability tuples',
        function () {
            var result;

            result = franc.all('XYZ');

            assert(result instanceof Array);
            assert(typeof result[0][0] === 'string');
            assert(typeof result[0][1] === 'number');
        }
    );

    it('should return [["und", 1]] on an undetermined value', function () {
        var result;

        result = franc.all('XYZ');

        assert(result[0][0] === 'und');
        assert(result[0][1] === 1);
        assert(result[0].length === 2);
        assert(result.length === 1);
    });

    it('should return [["und", 1]] on a missing value', function () {
        var result;

        result = franc.all();

        assert(result[0][0] === 'und');
        assert(result[0][1] === 1);
        assert(result[0].length === 2);
        assert(result.length === 1);
    });

    it('should work on weird values', function () {
        var result;

        result = franc.all('the the the the the ');

        assert(result[0][0] === 'sco');
        assert(result[0].length === 2);
        assert(result[1][0] === 'eng');
        assert(result[1].length === 2);
    });

    it('should accept blacklist parameter', function () {
        var shouldBeLanguage,
            result;

        shouldBeLanguage = franc(fixtures[MAGIC_NUMBER]);

        result = franc.all(fixtures[MAGIC_NUMBER], {
            'blacklist' : [shouldBeLanguage]
        });

        result.forEach(function (language) {
            assert(language[0] !== shouldBeLanguage);
        });
    });

    it('should accept whitelist parameter', function () {
        var result;

        result = franc.all(fixtures[MAGIC_NUMBER], {
            'whitelist' : [MAGIC_LANGUAGE]
        });

        assert(result.length === 1);
        assert(result[0][0] === MAGIC_LANGUAGE);
    });
});

describe('algorithm', function () {
    function classifyLanguage(input, language) {
        var example;

        example = input.replace(/\n/g, '\\n').slice(0, 20) + '...';

        describe(language.iso6393, function () {
            it('should classify `' + example + '` as ' + language.name,
                function () {
                    var result;

                    result = franc(input);

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

    support.forEach(function (language, index) {
        classifyLanguage(fixtures[index], language);
    });
});
