'use strict';

/* Dependencies. */
var fs = require('fs');
var udhr = require('udhr').json();
var support = require('../data/support');
var customFixtures = require('../data/custom-fixtures');

/* The minimum number of speakers to be included in
 * `franc`: 1,000,000. */
var THRESHOLD;

if (process.env.THRESHOLD) {
  THRESHOLD = Number(process.env.THRESHOLD);
}

if (THRESHOLD !== THRESHOLD || THRESHOLD === undefined) {
  THRESHOLD = 1e6;
}

if (THRESHOLD < 1e5) {
  console.log(
    'Long fixtures will be created, because ' +
    'the given threshold (`' + THRESHOLD + '`) ' +
    'includes language very similar to others.'
  );
} else {
  console.log(
    'Short fixtures will be created, because ' +
    'the given threshold (`' + THRESHOLD + '`) ' +
    'does not include languages very similar to ' +
    'others.'
  );
}

/* Get fixtures from UDHR preambles and notes. */
var data = [];

support.forEach(function (language) {
  var udhrKey = language.udhr;
  var fixture;

  if (udhrKey in customFixtures) {
    fixture = customFixtures[udhrKey];
  } else if (udhrKey in udhr) {
    if (udhr[udhrKey].preamble && udhr[udhrKey].preamble.para) {
      fixture = udhr[udhrKey].preamble.para;
    } else if (udhr[udhrKey].note && udhr[udhrKey].note[0]) {
      fixture = udhr[udhrKey].note[0].para;
    }
  }

  if (!fixture) {
    console.log(
      'Could not access preamble or note for `' +
      language.iso6393 + '` (' + udhrKey + ').\n' +
      'No fixture is generated.'
    );

    fixture = '';
  }

  fixture = fixture.slice(0, THRESHOLD >= 1e5 ? 200 : 500);

  data.push(fixture);
});

/* Add a fixture for `und`: Undetermined languages. */
data.und = '';

data = JSON.stringify(data, 0, 2);

/* Write. */
fs.writeFileSync('test/fixtures.json', data);
