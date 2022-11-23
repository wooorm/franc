import assert from 'node:assert/strict'
import test from 'node:test'
import {franc, francAll} from '../packages/franc/index.js'
import {fixtures} from './fixtures.js'

const languageA = 'pol'
const languageB = 'eng'
const fixtureB = fixtures[languageB].fixture
const hebrew = 'הפיתוח הראשוני בשנות ה־80 התמקד בגנו ובמערכת הגרפית'

if (languageA === franc(fixtureB)) {
  throw new Error('a and b should not be equal...')
}

test('franc()', () => {
  assert.equal(typeof franc, 'function', 'should be of type `function`')
  assert.equal(typeof franc('XYZ'), 'string', 'should return a string')
  assert.equal(
    franc('XYZ'),
    'und',
    'should return "und" on an undetermined value'
  )
  assert.equal(franc(), 'und', 'should return "und" on a missing value')
  assert.equal(
    franc('the the the the the '),
    'sco',
    'should work on weird values'
  )

  /* Inspired by lifthrasiir on hackernews:
   * https://news.ycombinator.com/item?id=8405672 */
  assert.equal(
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

  assert.equal(
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

  assert.equal(
    franc('すべての人は、生命、自由及び身体の安全に対する権利を有する。'),
    'jpn',
    'should detect Japanese even when Han ratio > 0.5 (udhr_jpn art 3) (1)'
  )

  assert.equal(
    franc(
      [
        'すべての人は、憲法又は法律によって与えられた基本的権利を侵害する行為に対し、',
        '権限を有する国内裁判所による効果的な救済を受ける権利を有する。'
      ].join('')
    ),
    'jpn',
    'should detect Japanese even when Han ratio > 0.5 (udhr_jpn art 8) (2)'
  )

  assert.equal(
    franc(
      [
        '成年の男女は、人種、国籍又は宗教によるいかなる制限をも受けることなく、婚姻し、',
        'かつ家庭をつくる権利を有する。成年の男女は、婚姻中及びその解消に際し、',
        '婚姻に関し平等の権利を有する。婚姻は、婚姻の意思を有する両当事者の自由かつ完全な合意によってのみ成立する。',
        '家庭は、社会の自然かつ基礎的な集団単位であって、社会及び国の保護を受ける権利を有する。'
      ].join('')
    ),
    'jpn',
    'should detect Japanese even when Han ratio > 0.5 (udhr_jpn art 16) (3)'
  )

  assert.notEqual(
    franc(fixtureB, {ignore: [franc(fixtureB)]}),
    franc(fixtureB),
    'should accept `ignore`'
  )

  assert.deepEqual(
    franc(fixtures.aii.fixture, {ignore: ['aii']}),
    'und',
    'should support `ignore` if the script can only be in that language'
  )

  assert.equal(
    franc(fixtureB, {only: [languageA]}),
    languageA,
    'should accept `only`'
  )

  assert.equal(
    franc(hebrew, {only: ['eng']}),
    'und',
    'should accept `only` for different scripts'
  )

  assert.equal(
    franc('the', {minLength: 3}),
    'sco',
    'should accept `minLength` (1)'
  )
  assert.equal(
    franc('the', {minLength: 4}),
    'und',
    'should accept `minLength` (2)'
  )

  assert.equal(
    franc('987 654 321'),
    'und',
    'should return `und` for generic characters'
  )
})

test('francAll()', () => {
  assert.equal(typeof francAll, 'function', 'should be of type `function`')

  assert.deepEqual(
    francAll('XYZ'),
    [['und', 1]],
    'should return an array containing language--probability tuples'
  )

  assert.deepEqual(
    francAll('פאר טסי'),
    [['und', 1]],
    'should return `[["und", 1]]` without matches (1)'
  )

  assert.deepEqual(
    francAll('פאר טסי', {minLength: 3}),
    [
      ['heb', 0],
      ['ydd', 0]
    ],
    'should return `[["und", 1]]` without matches (2)'
  )

  assert.deepEqual(
    francAll('xyz'),
    [['und', 1]],
    'should return `[["und", 1]]` without matches (3)'
  )

  assert.deepEqual(
    francAll(),
    [['und', 1]],
    'should return `[["und", 1]]` for a missing value'
  )

  assert.deepEqual(
    francAll('987 654 321'),
    [['und', 1]],
    'should return `[["und", 1]]` for generic characters'
  )

  assert.deepEqual(
    francAll('the the the the the ').slice(0, 2),
    [
      ['sco', 1],
      ['eng', 0.988_900_100_908_173_6]
    ],
    'should work on weird values'
  )

  assert.deepEqual(
    francAll(fixtureB, {ignore: [franc(fixtureB)]})
      .map((tuple) => {
        return tuple[0]
      })
      .indexOf(franc(fixtureB)),
    -1,
    'should accept `ignore`'
  )

  assert.deepEqual(
    francAll(fixtureB, {only: [languageA]}),
    [[languageA, 1]],
    'should accept `only`'
  )

  assert.deepEqual(
    francAll(hebrew, {only: ['eng']}),
    [['und', 1]],
    'should accept `only` for different scripts'
  )

  assert.deepEqual(
    francAll('the', {minLength: 3}).slice(0, 2),
    [
      ['sco', 1],
      ['eng', 0.998_885_172_798_216_3]
    ],
    'should accept `minLength` (1)'
  )

  assert.deepEqual(
    francAll('the', {minLength: 4}),
    [['und', 1]],
    'should accept `minLength` (2)'
  )
})

test('algorithm', () => {
  const keys = Object.keys(fixtures)

  // Failing for some reason.
  // Trigrams generated incorrectly?
  const ignore = new Set(['bos', 'prs'])

  for (const code of keys) {
    const info = fixtures[code]

    if (ignore.has(info.iso6393)) continue

    assert.equal(
      francAll(info.fixture)[0][0],
      info.iso6393,
      info.fixture.replace(/\n/g, '\\n').slice(0, 20) +
        '... (' +
        info.iso6393 +
        ')'
    )
  }
})
