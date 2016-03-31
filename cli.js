#!/usr/bin/env node
'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var pack = require('./package.json');
var franc = require('./');

/*
 * Detect if a value is expected to be piped in.
 */

var expextPipeIn = !process.stdin.isTTY;

/*
 * Arguments.
 */

var argv = process.argv.slice(2);

/*
 * Command.
 */

var command = Object.keys(pack.bin)[0];

/**
 * Help.
 *
 * @return {string} - Help message.
 */
function help() {
    return [
        '',
        'Usage: ' + command + ' [options] <string>',
        '',
        pack.description,
        '',
        'Options:',
        '',
        '  -h, --help                    output usage information',
        '  -v, --version                 output version number',
        '  -m, --min-length <number>     minimum length to accept',
        '  -w, --whitelist <string>      allow languages',
        '  -b, --blacklist <string>      disallow languages',
        '  -a, --all                     display all guesses',
        '',
        'Usage:',
        '',
        '# output language',
        '$ ' + command + ' "Alle menslike wesens word vry"',
        '# ' + franc('Alle menslike wesens word vry'),
        '',
        '# output language from stdin (expects utf8)',
        '$ echo "এটি একটি ভাষা একক IBM স্ক্রিপ্ট" | ' + command,
        '# ' + franc('এটি একটি ভাষা একক IBM স্ক্রিপ্ট'),
        '',
        '# blacklist certain languages',
        '$ ' + command + ' --blacklist por,glg ' +
            '"O Brasil caiu 26 posições"',
        '# ' + franc('O Brasil caiu 26 posições', {
            'blacklist': ['por', 'glg']
        }),
        '',
        '# output language from stdin with whitelist',
        '$ echo "Alle mennesker er født frie og" | ' + command +
            ' --whitelist nob,dan',
        '# ' + franc('Alle mennesker er født frie og', {
            'whitelist': ['nob', 'dan']
        }),
        ''
    ].join('\n  ') + '\n';
}

var index;
var blacklist;
var whitelist;
var minLength;
var all = false;

/**
 * Log the language for `value`.
 *
 * @param {string} value - Value to detect.
 */
function detect(value) {
    if (value && value.length) {
        var param = {
            'minLength': minLength,
            'whitelist': whitelist,
            'blacklist': blacklist
        };
        if (all) {
            franc.all(value, param).map(function (language) {
                console.log(language[0] + ' ' + language[1]);
            });
        } else {
            console.log(franc(value, param));
        }
    } else {
        /* eslint-disable no-process-exit */
        process.stderr.write(help());
        process.exit(1);
    }
}

/*
 * Program.
 */

if (
    argv.indexOf('--help') !== -1 ||
    argv.indexOf('-h') !== -1
) {
    console.log(help());
} else if (
    argv.indexOf('--version') !== -1 ||
    argv.indexOf('-v') !== -1
) {
    console.log(pack.version);
} else {
    index = argv.indexOf('--min-length');

    if (index === -1) {
        index = argv.indexOf('-m');
    }

    if (index !== -1) {
        minLength = Number(argv[index + 1] || '');

        argv.splice(index, 2);
    }

    index = argv.indexOf('--blacklist');

    if (index === -1) {
        index = argv.indexOf('-b');
    }

    if (index !== -1) {
        blacklist = (argv[index + 1] || '').split(',');

        argv.splice(index, 2);
    }

    index = argv.indexOf('--whitelist');

    if (index === -1) {
        index = argv.indexOf('-w');
    }

    if (index !== -1) {
        whitelist = (argv[index + 1] || '').split(',');

        argv.splice(index, 2);
    }

    index = argv.indexOf('--all');

    if (index === -1) {
        index = argv.indexOf('-a');
    }

    if (index !== -1) {
        all = true;

        argv.splice(index, 1);
    }

    if (argv.length) {
        detect(argv.join(' '));
    } else if (!expextPipeIn) {
        detect([]);
    } else {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function (data) {
            detect(data.trim());
        });
    }
}
