var fs = require('fs'),
    fixtures = require('../spec/fixtures.json'),
    languages = require('../data/iso-639-2-languages.json');

languages.und = '‡ **Special: Case for unknown language**';

fs.writeFileSync('Supported-Languages.md',
    'Supported Languages:\n' +
    '=================\n' +
    '\n' +
    '- † — Undetermined languages will result in the "und" language code\n' +
    '\n' +
    '| name | iso-639-2 | example |\n' +
    '|:----:|:---------:|:-------:|\n' +

    Object.keys(fixtures).map(function (languageCode) {
        var fixture = fixtures[languageCode],
            languageName = languages[languageCode],
            example = fixture.substr(0, 25).replace(/\n/g, ' ').trim();

        return '| ' + [
            languageName,
            languageCode,
            example
        ].join(' | ') + ' |';
    }).join('\n') +

    '\n'
);
