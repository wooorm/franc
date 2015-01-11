#!/bin/sh
#!/bin/bash

typeset -i tests=0

function try {
    let tests+=1;
    description="$1";
}

function assert {
    if [[ "$1" == "$2" ]]; then
        printf "\033[32m.\033[0m"
    else
        printf "\033[31m\nFAIL: $description\033[0m: '$1' != '$2'\n";
        exit 1
    fi
}

try "Value"
    result=`./cli.js "Alle menslike wesens word vry"` 2> /dev/null
    assert $result "afr"

try "Stdin"
    result=`echo "Alle menslike wesens word vry" | ./cli.js` 2> /dev/null
    assert $result "afr"

try "Whitelist: long"
    result=`./cli.js --whitelist nob,dan "Alle mennesker er født frie og"` 2> /dev/null
    assert $result "nob"

try "Whitelist: short"
    result=`./cli.js -w nob,dan "Alle mennesker er født frie og"` 2> /dev/null
    assert $result "nob"

try "Blacklist: long"
    result=`./cli.js --blacklist por,glg "O Brasil caiu 26 posições em"` 2> /dev/null
    assert $result "src"

try "Blacklist: short"
    result=`./cli.js -b por,glg "O Brasil caiu 26 posições em"` 2> /dev/null
    assert $result "src"

try "Help: long"
    code=0
    ./cli.js --help > /dev/null 2>&1 || code=$?
    assert $code 0

try "Help: short"
    code=0
    ./cli.js -h > /dev/null 2>&1 || code=$?
    assert $code 0

try "Version: long"
    code=0
    ./cli.js --version > /dev/null 2>&1 || code=$?
    assert $code 0

try "Version: short"
    code=0
    ./cli.js -v > /dev/null 2>&1 || code=$?
    assert $code 0

printf "\033[32m\n(✓) Passed $tests assertions without errors\033[0m\n";

exit 0
