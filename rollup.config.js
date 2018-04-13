import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

const banner = `/**
 * ${pkg.name} - ${pkg.description}
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @license ${pkg.license}
 **/
`;

const [ filename ] = pkg.main.split( '/' ).reverse();
const name = filename.replace( '.js', '' );

export default {
  input: pkg.module,
  output: {
    banner,
    file: pkg.main,
    format: 'umd',
    indent: '  ',
    name
  },
  plugins: [
    replace({
      'Array.from': 'Array.prototype.slice.call'
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
