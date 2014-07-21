var franc = require('franc');

var inputElement = document.getElementsByTagName('textarea')[0];
var outputElement = document.getElementsByTagName('ol')[0];
var buttonElement = document.getElementsByTagName('button')[0];
var wrapperElement = document.getElementsByTagName('div')[0];

buttonElement.addEventListener('click', detectLanguage);

wrapperElement.style.display = 'none';

function detectLanguage() {
    visualiseResults(franc.all(inputElement.value));
}

function visualiseResults(results) {
    wrapperElement.style.display = '';
    console.log('visualiseResults');
    cleanOutputElement();
    results = results.map(createResult);
    
    results.forEach(function (node) {
        outputElement.appendChild(node);
    });

    console.log('visualiseResults:2');
    results[0].classList.add('franc__probable')
}

function cleanOutputElement() {
    while (outputElement.firstElementChild) {
        outputElement.removeChild(outputElement.firstElementChild);
    }
}

function createResult(result, n) {
    var node = document.createElement('li');

    node.textContent = result[0] + ': ' + result[1];

    return node;
}