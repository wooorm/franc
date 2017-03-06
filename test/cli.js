'use strict';

var path = require('path');
var PassThrough = require('stream').PassThrough;
var test = require('tape');
var execa = require('execa');

var root = path.resolve(process.cwd(), 'packages', 'franc-cli');
var pkg = require(path.resolve(root, 'package.json'));
var cli = path.resolve(root, 'index.js');

test('cli', function (t) {
  t.plan(17);

  ['-v', '--version'].forEach(function (flag) {
    execa
      .stdout(cli, [flag])
      .then(function (result) {
        t.equal(result, pkg.version, flag);
      }, t.ifErr);
  });

  ['-h', '--help'].forEach(function (flag) {
    execa
      .stdout(cli, [flag])
      .then(function (result) {
        t.ok(/^\s+CLI to detect the language of text/.test(result), flag);
      }, t.ifErr);
  });

  execa
    .stdout(cli, ['Alle menslike wesens word vry'])
    .then(function (result) {
      t.equal(result, 'afr', 'argument');
    }, t.ifErr);

  execa
    .stdout(cli, ['Alle', 'menslike', 'wesens', 'word', 'vry'])
    .then(function (result) {
      t.equal(result, 'afr', 'multiple arguments');
    }, t.ifErr);

  t.test('stdin', function (st) {
    var stream = new PassThrough();
    var values = ['Alle', 'menslike', 'wesens', 'word', 'vry'];
    var index = -1;
    var length = values.length;

    st.plan(1);

    function send() {
      index++;

      if (index === length) {
        stream.end(values[index]);
      } else {
        stream.write(values[index] + ' ');
        setTimeout(send, 10);
      }
    }

    send();

    execa
      .stdout(cli, {input: stream})
      .then(function (result) {
        st.equal(result, 'afr', 'stdin');
      }, st.ifErr);
  });

  ['-w', '--whitelist'].forEach(function (flag) {
    execa
      .stdout(cli, [flag, 'nob,dan', 'Alle mennesker er født frie og'])
      .then(function (result) {
        t.equal(result, 'nob', flag);
      }, t.ifErr);
  });

  ['-b', '--blacklist'].forEach(function (flag) {
    execa
      .stdout(cli, [flag, 'por,glg', 'O Brasil caiu 26 posições'])
      .then(function (result) {
        t.equal(result, 'src', flag);
      }, t.ifErr);
  });

  ['-m', '--min-length'].forEach(function (flag) {
    execa
      .stdout(cli, [flag, '3', 'the'])
      .then(function (result) {
        t.equal(result, 'sco', flag + ' (satisfied)');
      }, t.ifErr);

    execa
      .stdout(cli, [flag, '4', 'the'])
      .then(function (result) {
        t.equal(result, 'und', flag + ' (unsatisfied)');
      }, t.ifErr);
  });

  ['-a', '--all'].forEach(function (flag) {
    execa
      .stdout(cli, [flag, 'Alle menslike wesens word vry'])
      .then(function (result) {
        t.deepEqual(
          result.split('\n').slice(0, 3),
          [
            'afr 1',
            'nld 0.7532813781788351',
            'nob 0.5412223133716161'
          ],
          flag
        );
      }, t.ifErr);
  });
});
