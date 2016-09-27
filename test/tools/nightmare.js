/* jshint esnext:true, node:true  */
const Nightmare   = require( 'nightmare' );

/**
 * Add focus action
 *
 * Usage:
 * .focus( selector ) => .focus( '.myClass' )
 */
Nightmare.action( 'focus', function ( selector, done ) {
  this.evaluate_now(( selector ) => {
    document.activeElement.blur();
    var element = document.querySelector( selector );
    element.focus();
  }, done, selector );
});


/**
 * Add keyboard events actions
 *
 * Usage:
 * .key( keyCode ) => .key( 13 ) for the `Enter` key
 * .key( optionsObject )
 * optionsObject = {
 *   alt: [true|false],
 *   ctrl: [true|false],
 *   code: [number],
 *   meta: [true|false],
 *   shift: [true|false]
 * }
 */
Nightmare.action( 'key', function ( opts, done ) {
  this.evaluate_now(( opts ) => {

    var options = opts;

    if ( typeof options === 'number' || typeof options === 'string' ) {
      options = {
        code: parseInt( options ),
        which: parseInt( options )
      };
    }

    var event = document.createEvent( 'Events' );
    event.initEvent( 'keydown', true, true );

    event.altKey   = options.alt || false;
    event.ctrlKey  = options.ctrl || false;
    event.keyCode  = options.code;
    event.metaKey  = options.meta || false;
    event.shiftKey = options.shift || false;
    event.which    = options.code;

    document.activeElement.dispatchEvent( event );
  }, done, opts );
});


module.exports = Nightmare;
