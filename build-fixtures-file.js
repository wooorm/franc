'use strict';

var fixtures = {},
    iterator = -1,
    directory = './spec',
    fixtureDirectory = directory + '/fixtures',
    files, file, filename, fixture, fs, extensionIndex;

fs = require('fs');

files = fs.readdirSync(fixtureDirectory);

while (files[++iterator]) {
    file = files[iterator];
    extensionIndex = file.indexOf('.txt');

    if (extensionIndex === -1) {
        continue;
    }

    filename = file.substr(0, extensionIndex);
    fixture = fs.readFileSync(fixtureDirectory + '/' + file, 'utf-8');

    fixtures[filename] = fixture.trim();
}

fixtures = JSON.stringify(fixtures, null, 4);
fs.writeFileSync(directory + '/fixtures.json', fixtures);

module.exports = fixtures;
