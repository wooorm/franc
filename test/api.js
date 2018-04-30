'use strict'

var test = require('tape')
var franc = require('../packages/franc')
var fixtures = require('./fixtures')

var languageA = 'pol'
var languageB = 'eng'
var fixtureB = fixtures[languageB].fixture
var hebrew = 'הפיתוח הראשוני בשנות ה־80 התמקד בגנו ובמערכת הגרפית'

if (languageA === franc(fixtureB)) {
  throw new Error('a and b should not be equal...')
}

test('franc()', function(t) {
  t.equal(typeof franc, 'function', 'should be of type `function`')
  t.equal(typeof franc('XYZ'), 'string', 'should return a string')
  t.equal(franc('XYZ'), 'und', 'should return "und" on an undetermined value')
  t.equal(franc(), 'und', 'should return "und" on a missing value')
  t.equal(franc('the the the the the '), 'sco', 'should work on weird values')

  /* Inspired by lifthrasiir on hackernews:
   * https://news.ycombinator.com/item?id=8405672 */
  t.equal(
    franc(
      [
        '한국어 문서가 전 세계 웹에서 차지하는 비중은 2004년에 4.1%로, 이는 영어(35.8%), ',
        '중국어(14.1%), 일본어(9.6%), 스페인어(9%), 독일어(7%)에 이어 전 세계 6위이다. ',
        '한글 문서와 한국어 문서를 같은것으로 볼 때, 웹상에서의 한국어 사용 인구는 전 세계 ',
        '69억여 명의 인구 중 약 1%에 해당한다.'
      ].join('')
    ),
    'kor',
    'should work on unique-scripts with many latin characters (1)'
  )

  t.equal(
    franc(
      [
        '現行の学校文法では、英語にあるような「目的語」「補語」などの成分はないとする。',
        '英語文法では "I read a book." の "a book" はSVO文型の一部をなす目的語であり、',
        'また、"I go to the library." の "the library" ',
        'は前置詞とともに付け加えられた修飾語と考えられる。'
      ].join('\n')
    ),
    'jpn',
    'should work on unique-scripts with many latin characters (2)'
  )

  t.notEqual(
    franc(fixtureB, {blacklist: [franc(fixtureB)]}),
    franc(fixtureB),
    'should accept `blacklist`'
  )

  t.equal(
    franc(fixtureB, {whitelist: [languageA]}),
    languageA,
    'should accept `whitelist`'
  )

  t.equal(
    franc(hebrew, {whitelist: ['eng']}),
    'und',
    'should accept `whitelist` for different scripts'
  )

  t.equal(franc('the', {minLength: 3}), 'sco', 'should accept `minLength` (1)')
  t.equal(franc('the', {minLength: 4}), 'und', 'should accept `minLength` (2)')

  t.equal(
    franc('987 654 321'),
    'und',
    'should return `und` for generic characters'
  )

  t.end()
})

test('franc.all()', function(t) {
  t.equal(typeof franc.all, 'function', 'should be of type `function`')

  t.deepEqual(
    franc.all('XYZ'),
    [['und', 1]],
    'should return an array containing language--probability tuples'
  )

  t.deepEqual(
    franc.all('פאר טסי'),
    [['und', 1]],
    'should return `[["und", 1]]` without matches (1)'
  )

  t.deepEqual(
    franc.all('פאר טסי', {minLength: 3}),
    [['heb', 0], ['ydd', 0]],
    'should return `[["und", 1]]` without matches (2)'
  )

  t.deepEqual(
    franc.all('xyz'),
    [['und', 1]],
    'should return `[["und", 1]]` without matches (3)'
  )

  t.deepEqual(
    franc.all(),
    [['und', 1]],
    'should return `[["und", 1]]` for a missing value'
  )

  t.deepEqual(
    franc.all('987 654 321'),
    [['und', 1]],
    'should return `[["und", 1]]` for generic characters'
  )

  t.deepEqual(
    franc.all('the the the the the ').slice(0, 2),
    [['sco', 1], ['eng', 0.9858799798285426]],
    'should work on weird values'
  )

  t.deepEqual(
    franc
      .all(fixtureB, {blacklist: [franc(fixtureB)]})
      .map(function(tuple) {
        return tuple[0]
      })
      .indexOf(franc(fixtureB)),
    -1,
    'should accept `blacklist`'
  )

  t.deepEqual(
    franc.all(fixtureB, {whitelist: [languageA]}),
    [[languageA, 1]],
    'should accept `whitelist`'
  )

  t.deepEqual(
    franc.all(hebrew, {whitelist: ['eng']}),
    [['und', 1]],
    'should accept `whitelist` for different scripts'
  )

  t.deepEqual(
    franc.all('the', {minLength: 3}).slice(0, 2),
    [['sco', 1], ['eng', 0.9988851727982163]],
    'should accept `minLength` (1)'
  )

  t.deepEqual(
    franc.all('the', {minLength: 4}),
    [['und', 1]],
    'should accept `minLength` (2)'
  )

  t.end()
})

test('algorithm', function(t) {
  Object.keys(fixtures).forEach(function(code) {
    var info = fixtures[code]

    if (info.fixture) {
      t.equal(
        franc.all(info.fixture)[0][0],
        info.iso6393,
        info.fixture.replace(/\n/g, '\\n').slice(0, 20) + '... (' + code + ')'
      )
    } else {
      console.log('Missing fixture for UDHR `' + code + '`')
    }
  })

  t.end()
})
