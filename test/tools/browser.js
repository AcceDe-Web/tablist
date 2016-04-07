/* jshint esnext:true, node:true  */
/* globals require, __dirname  */

'use strict';

const Browser = require( './nightmare' );
const path    = 'file://' + __dirname + '/../accordion.html';

function loadBrowser() {
  const browser = new Browser({
    show: false
  });
  return browser.goto( path );
}

module.exports = loadBrowser;
