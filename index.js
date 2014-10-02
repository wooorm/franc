var franc = require('franc');
var fixtures = require('./fixtures.json');
var debounce = require('debounce');
var examples;
var key;

examples = [];

for (key in fixtures) {
    examples.push(fixtures[key]);
}

var inputElement = document.getElementsByTagName('textarea')[0];
var outputElement = document.getElementsByTagName('ol')[0];
var wrapperElement = document.getElementsByTagName('div')[0];

inputElement.addEventListener('input', debounce(detectLanguage, 50));

inputElement.value = getExample();

function getExample() {
    return examples[Math.floor(Math.random() * examples.length)];
}

function detectLanguage() {
    visualiseResults(franc.all(inputElement.value));
}

function visualiseResults(results) {
    wrapperElement.style.display = '';

    while (outputElement.firstElementChild) {
        outputElement.removeChild(outputElement.firstElementChild);
    }

    results = results.map(createResult);

    results.forEach(function (node) {
        outputElement.appendChild(node);
    });
}

function createResult(result, n) {
    var node = document.createElement('li');

    node.textContent = result[0] + ': ' + result[1];

    return node;
}

detectLanguage();
