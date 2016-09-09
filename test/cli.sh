#!/bin/sh
#!/bin/bash

typeset -i tests=0

function it {
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

it "Should accept an argument"
  result=`./cli.js "Alle menslike wesens word vry"` 2> /dev/null
  assert $result "afr"

it "Should accept multiple arguments"
  result=`./cli.js "Alle" "menslike" "wesens" "word" "vry"` 2> /dev/null
  assert $result "afr"

it "Should accept stdin"
  result=`echo "Alle menslike wesens word vry" | ./cli.js` 2> /dev/null
  assert $result "afr"

it "Should fail when no values are piped in and no values are given"
  code=0
  ./cli.js > /dev/null 2>&1 || code=$?
  assert $code 1

it "Should accept \`--whitelist\`"
  result=`./cli.js --whitelist nob,dan "Alle mennesker er født frie og"` 2> /dev/null
  assert $result "nob"

it "Should accept \`-w\`"
  result=`./cli.js -w nob,dan "Alle mennesker er født frie og"` 2> /dev/null
  assert $result "nob"

it "Should accept \`--blacklist\`"
  result=`./cli.js --blacklist por,glg "O Brasil caiu 26 posições"` 2> /dev/null
  assert $result "src"

it "Should accept \`-b\`"
  result=`./cli.js -b por,glg "O Brasil caiu 26 posições"` 2> /dev/null
  assert $result "src"

it "Should accept \`--min-length\`"
  result=`./cli.js --min-length 3 "the"` 2> /dev/null
  assert $result "sco"

  result=`./cli.js --min-length 4 "the"` 2> /dev/null
  assert $result "und"

it "Should accept \`-m\`"
  result=`./cli.js -m 3 "the"` 2> /dev/null
  assert $result "sco"

  result=`./cli.js -m 4 "the"` 2> /dev/null
  assert $result "und"

it "Should accept \`--all\`"
  result=`./cli.js --all "Alle menslike wesens word vry" | grep afr | cut -f2 -d\ ` 2> /dev/null
  assert $result 1

it "Should accept \`--a\`"
  result=`./cli.js -a "Alle menslike wesens word vry" | grep afr | cut -f2 -d\ ` 2> /dev/null
  assert $result 1

it "Should accept \`--help\`"
  code=0
  ./cli.js --help > /dev/null 2>&1 || code=$?
  assert $code 0

it "Should accept \`-h\`"
  code=0
  ./cli.js -h > /dev/null 2>&1 || code=$?
  assert $code 0

it "Should accept \`--version\`"
  code=0
  ./cli.js --version > /dev/null 2>&1 || code=$?
  assert $code 0

it "Should accept \`-v\`"
  code=0
  ./cli.js -v > /dev/null 2>&1 || code=$?
  assert $code 0

printf "\033[32m\n(✓) Passed $tests assertions without errors\033[0m\n";
