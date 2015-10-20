var MATCHES = Element.prototype.matches ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector;
function matches( el, selector ){
  if( MATCHES ){
    return MATCHES.call( el, selector );
  }

  var els = (el.document || el.ownerDocument).querySelectorAll( selector ),
  index = 0;

  while (els[index] && els[index] !== el) {
    ++index;
  }

  return els[index] ? true : false;
}

function delegate( root, event, selector, callback ){

  function returnEvent( e, currentTarget ){
    function Event( e, currentTarget ){
      for( var key in e ){
        if( 'function' === typeof e[key] ){
          continue;
        }
        if( key === key.toUpperCase() ) {
          continue;
        }

        this[ key ] = e[ key ];
      }

      this.originalEvent = e;
      this.currentTarget = currentTarget;
    }

    Event.prototype.preventDefault = function(){
      this.originalEvent.preventDefault();
    };

    Event.prototype.stopPropagation = function(){
      this.originalEvent.stopPropagation();
    };

    Event.prototype.stopImmediatePropagation = function(){
      this.originalEvent.stopImmediatePropagation();
    };

    return new Event( e, currentTarget );
  }

  (function( root, event, selector, callback ){
    root.addEventListener( event, function( e ){
      var match = document.querySelectorAll( selector ),
          eLength = match.length,
          index = 0;

      while( index < eLength ){
        if( e.target === match[index] || match[index].contains( e.target ) ){
          callback( returnEvent( e, match[index] ) );
          break;
        }
        index++;
      }

    }, ( 'focus' === event || 'blur' === event ) );
  })( root, event, selector, callback );
}

