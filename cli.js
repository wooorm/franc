#!/usr/bin/env node
'use strict';

/*
 * Dependencies.
 */

var franc,
    pack;

pack = require('./package.json');
franc = require('./');

/*
 * Detect if a value is expected to be piped in.
 */

var expextPipeIn;

expextPipeIn = !process.stdin.isTTY;

/*
 * Arguments.
 */

var argv;

argv = process.argv.slice(2);

/*
 * Command.
 */

var command;

command = Object.keys(pack.bin)[0];

/**
 * Help.
 *
 * @return {string}
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
        '  -w, --whitelist <string>      allow languages',
        '  -b, --blacklist <string>      disallow languages',
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
            '"O Brasil caiu 26 posições em"',
        '# ' + franc('O Brasil caiu 26 posições em', {
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

var index,
    blacklist,
    whitelist;

/**
 * Log the language for `value`.
 *
 * @param {string} value
 */
function detect(value) {
    if (value && value.length) {
        console.log(franc(value, {
            'whitelist': whitelist,
            'blacklist': blacklist
        }));
    } else {
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
