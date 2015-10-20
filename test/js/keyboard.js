var formElements = [ 'INPUT', 'TEXTAREA', 'SELECT' ],
    types = [ 'radio', 'checkbox' ],
    off;

function keyboardNavigation( e ){
  if( formElements.indexOf( e.target.nodeName ) >= 0 && types.indexOf( e.target.type ) < 0 ){
    return;
  }

  window.clearTimeout( off );

  if( !document.documentElement.classList.contains( 'keyboard' ) && ( 9 === e.keyCode || 17 === e.keyCode ) ){
    document.documentElement.classList.add( 'keyboard' );
  }

  off = window.setTimeout( function(){
    document.documentElement.classList.remove( 'keyboard' );
  }, 4000 );

}

document.body.addEventListener( 'keydown', keyboardNavigation );
