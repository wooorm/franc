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
 * Log help.
 */
function help() {
    console.log([
        '',
        'Usage: ' + pack.name + ' [options] string',
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
        '# output language of value',
        '$ ' + command + ' "Alle menslike wesens word vry"',
        '# afr',
        '',
        '# output language from stdin (expects utf8)',
        '$ echo "এটি একটি ভাষা একক IBM স্ক্রিপ্ট" | ' + command,
        '# ben',
        '',
        '# blacklist certain languages',
        '$ ' + command + ' --blacklist por,glg ' +
            '"O Brasil caiu 26 posições em"',
        '# src',
        '',
        '# whitelist certain languages and use stdin',
        '$ echo "Alle mennesker er født frie og" | ' +
            command + ' --whitelist nob,dan',
        '# nob'
    ].join('\n  ') + '\n');
}

/*
 * Program.
 */

var index,
    blacklist,
    whitelist;

/**
 * Log the language for `value`.
 *
 * @param {string} value
 */
function detect(value) {
    console.log(franc(value, {
        'whitelist': whitelist,
        'blacklist': blacklist
    }));
}

if (
    argv.indexOf('--help') === 0 ||
    argv.indexOf('-h') === 0
) {
    help();
} else if (
    argv.indexOf('--version') === 0 ||
    argv.indexOf('-v') === 0
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

    if (argv.length === 1) {
        detect(argv[0]);
    } else if (argv.length) {
        help();
    } else {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', detect);
    }
}
