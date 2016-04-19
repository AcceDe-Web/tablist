/* jshint esnext:true, node:true  */
/* globals require  */

'use strict';

const Browser = require( './nightmare' );

function loadBrowser( path ) {
  const browser = new Browser({
    show: false
  });
  return browser.goto( path );
}

module.exports = loadBrowser;
