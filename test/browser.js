'use strict';

/*
 * Dependencies.
 */

var assert = require('assert');
var PhantomConstructor = require('phantom');

/**
 * Open `url` in `phantom`.
 * Asserts if the document's title contains `"passed"`.
 *
 * @param {Object} phantom
 * @param {string} url
 * @param {function(Error?)} done
 */
function open(phantom, url, done) {
    phantom.createPage(function (page) {
        page.open(url, function (status) {
            if (status !== 'success') {
                done(new Error('Could not open globals'));
            } else {
                setTimeout(function () {
                    page.evaluate(function () {
                        return document.title;
                    }, function (result) {
                        assert(/passed/i.test(result));

                        done();
                    });
                }, 50);
            }
        });
    });
}

describe('Browser', function () {
    var phantom;

    before(function (done) {
        PhantomConstructor.create(function (value) {
            phantom = value;

            done();
        });
    });

    it('should work with globals', function (done) {
        open(phantom, './test/browser/globals.html', done);
    });

    it('should work with AMD', function (done) {
        open(phantom, './test/browser/amd.html', done);
    });

    after(function () {
        phantom.exit();
    });
});
