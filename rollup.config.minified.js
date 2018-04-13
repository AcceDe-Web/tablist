import pkg from './package.json';
import config from './rollup.config.js';
import uglify from 'rollup-plugin-uglify';

config.output.file = pkg.main.replace( '.js', '.min.js' );
config.plugins.push( uglify({
  output: {
    'comments': ( node, comment ) => {
      const text = comment.value,
        type = comment.type;

      if ( type === 'comment2' ) {
        // multiline comment
        return /@preserve|@license|@cc_on/i.test( text );
      }
    }
  }
}));

export default config;
