'use strict';

var fs,
    table,
    support;

fs = require('fs');
table = require('markdown-table');
support = require('../data/support');

support.unshift({
    'iso6393': 'und',
    'name': '† **Special: Case for unknown language**'
});

fs.writeFileSync('Supported-Languages.md',
    'Supported Languages:\n' +
    '=================\n' +
    '\n' +
    '- † — Undetermined languages will result in the "und" language code\n' +
    '\n' +
    table([
            ['ISO-639-3', 'Name', 'Script', 'Speakers']
        ].concat(support.map(function (language) {
            return [
                '[' + language.iso6393 + '](http://www-01.sil.org/' +
                'iso639-3/documentation.asp?id=' + language.iso6393 + ')',
                language.name,
                language.script,
                language.speakers
            ];
        })),
        {
            'align': ['c', 'c', 'c', 'r']
        }
    ) +

    '\n'
);
