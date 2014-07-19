var fs = require('fs'),
    fixtures = require('./spec/fixtures.json'),
    languages = require('./spec/iso-639-2-languages.json');

languages.und = '‡ **Special: Case for unknown language**';
languages['pt-BR'] = '§ **Portuguese (Brazilian)**';
languages['pt-PT'] = '§ **Portuguese (European)**';

fs.writeFileSync('Supported-Languages.md',
    'Supported Languages:\n' +
    '=================\n' +
    '\n' +
    '† — Almost all language codes are in iso-639-2, two-letter if ' +
    'available, otherwise three-letter. Both pt-BR (Brazilian Portuguese) ' +
    'and pt-PT (European Portuguese) are the only exceptions.\n' +
    '‡ — Undetermined languages will result in the "und" language code\n' +
    '§ — Portuguese\n' +
    '\n' +
    '| name | iso-639-2† | example |\n' +
    '|:----:|:---------:|:-------:|\n' +

    Object.keys(fixtures).map(function (languageCode) {
        var fixture = fixtures[languageCode],
            languageName = languages[languageCode],
            example = fixture.substr(0, 25).trim();

        return '| ' + [
            languageName,
            languageCode,
            example
        ].join(' | ') + ' |';
    }).join('\n') +

    '\n'
);
