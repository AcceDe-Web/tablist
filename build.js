/* jshint node:true, esversion:6 */

/* Building process:
 * - read source file
 * - add licensing information
 * - output compressed file
 * - write uncompressed and compressed files to dist directory
 *
 * All data for the banner can be found into the package.json file
 */

'use strict';

const pkg    = require( './package.json' ),
      Uglify = require( 'uglify-js' ),
      fs     = require( 'fs' ),
      source = 'lib/tablist.js',
      dest   = 'dist/',
      files  = [ 'tablist.js', 'tablist.min.js' ],
      banner = [
        `/**`,
        ` * ${pkg.name} - ${pkg.description}`,
        ` * @version v${pkg.version}`,
        ` * @link ${pkg.homepage}`,
        ` * @license ${pkg.license}`,
        ` */`,
      '\n' ].join( '\n' );

let libCode = [];
fs.readFile( source, ( err, data ) => {
  if ( err ) {
    throw err;
  }

  libCode.push( banner + data );

  let libMin = Uglify.minify( libCode[ 0 ], {
    compress: {},
    'fromString': true,
    'output': {
      'comments': ( node, comment ) => {
        const text = comment.value,
              type = comment.type;
        if ( type === 'comment2' ) {
          // multiline comment
          return /@preserve|@license|@cc_on/i.test( text );
        }
      }
    }
  });

  libCode.push( libMin.code );

  // write files to /dist folder
  libCode.forEach(( code, i ) => {
    fs.writeFile( dest + files[ i ], code, ( err ) => {
      if ( err ) {
        throw err;
      }
    });
  });
});
