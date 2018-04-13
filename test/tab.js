/* jshint esnext:true, node:true  */
/* globals require, __dirname */

'use strict';

const test        = require( 'tape' );
const loadBrowser = require( './tools/browser' );
const path        = 'file://' + __dirname + '/tab.html';


// Label test suite in output
test( '-------------------------------', ( t ) => {
  t.comment( 'Running *Tab* test suite.' );
  t.comment( '-------------------------------' );
  t.end();
});


// test 1
test( '1| L’onglet ayant le focus est le seul à avoir la valeur « true » pour l’attribut « aria-selected ».', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '[role="tab"]' )
    .evaluate(() => {
      return {
        ariaSelected: document.activeElement.getAttribute( 'aria-selected' ),
        selectedItems: document.querySelectorAll( '[aria-selected="true"]' ).length
      };
    })
    .end() // close browser
    .then(( actual ) => {
      t.equal( actual.ariaSelected, 'true', '« aria-selected » doit valoir « true ».' );
      t.equal( actual.selectedItems, 1, '« 1 » seul élément doit avoir un « aria-selected » à « true ».' );
      t.end();
    });
});


// test 2
test( '2| L’onglet ayant le focus est le seul à avoir la valeur « 0 » pour l’attribut « tabindex ».', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab2' )
    .evaluate(() => {
      return {
        tabindex: document.activeElement.getAttribute( 'tabindex' ),
        tabindexedItems: document.querySelectorAll( '[role="tab"][tabindex="0"]' ).length
      };
    })
    .end() // close browser
    .then(( actual ) => {
      t.equal( actual.tabindex, '0', '« tabindex » doit valoir « 0 ».' );
      t.equal( actual.tabindexedItems, 1, '« 1 » seul élément doit avoir un « tabindex » à « 0 ».' );
      t.end();
    });
});


// test 3
test( '3| Le panneau associé à l’onglet ayant le focus est le seul à avoir la valeur « false » pour l’attribut « aria-hidden ».', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab2' )
    .evaluate(() => {

      var panels   = document.querySelectorAll( '[role="tabpanel"]' ),
          selected = [],
          i        = 0,
          iLen     = panels.length;

      for(; i < iLen; i++ ) {
        if ( panels[ i ].getAttribute( 'aria-hidden' ) === 'false' ) {
          selected.push( panels[ i ] );
        }
      }

      return selected.length === 1 && selected[ 0 ].id === 'tabpanel2';
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'Seul un panneau doit avoir l’attribut « aria-hidden » qui vaut « false ».' );
      t.end();
    });
});


// test 4
test( '4| Les onglets n’ayant pas le focus ont la valeur « false » pour l’attribut « aria-selected ».', ( t ) => {
  loadBrowser( path ) // open browser
    .evaluate(() => {
      return {
        actual: document.querySelectorAll( '[aria-selected="true"]' ).length,
        expected: 0
      };
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results.actual, results.expected, 'Aucune onglet n’a le focus au chargement. On doit donc retrouver tous les entêtes non sélectionnés.' );
      t.end();
    });
});


// test 5
test( '5| Les onglets n’ayant pas le focus ont la valeur « -1 » pour l’attribut « tabindex ».', ( t ) => {
  loadBrowser( path ) // open browser
    .evaluate(() => {
      return {
        first: document.querySelector( '[role="tab"]' ).getAttribute( 'tabindex' ) === '0',
        others: document.querySelectorAll( '[role="tab"][tabindex="-1"]' ).length
      };
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results.first, true, 'Seul le premier onglet est focusable (« tabindex » à « 0 »).' );
      t.equal( results.others, 3, 'Tous les autres onglets ne sont pas focusables (« tabindex » à « -1 »)' );
      t.end();
    });
});


// test 6
test( '6| Un « Click » sur un onglet dont la valeur l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab2' )
    .evaluate(() => {
      var tab = document.getElementById( 'tab2' );

      return {
        ariaExpanded: tab.getAttribute( 'aria-expanded' ),
        ariaHidden: document.querySelector( '#tabpanel2' ).getAttribute( 'aria-hidden' )
      };
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results.ariaExpanded, 'true', 'L’élément doit être actif.' );
      t.equal( results.ariaHidden, 'false', 'L’élément doit être affiché.' );
      t.end();
    });
});


// test 7
test( '7| Les panneaux associés aux onglets n’ayant pas le focus ont la valeur « true » pour l’attribut « aria-hidden »', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab2' )
    .evaluate(() => {

      var panels   = document.querySelectorAll( '[role="tabpanel"]' ),
          selected = [],
          i        = 0,
          iLen     = panels.length;

      for(; i < iLen; i++ ) {
        if ( panels[ i ].getAttribute( 'aria-hidden' ) === 'true' ) {
          selected.push( panels[ i ] );
        }
      }

      return selected.length === 3;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'Tous les panneaux sauf 1 doivent avoir l’attribut « aria-hidden » qui vaut « true ».' );
      t.end();
    });
});




// test 8
test( '8| Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur le premier onglet déplace le focus sur le dernier onglet.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab1' )
    .key( 38 ) // `ArrowUp` key
    .evaluate(() => {
      return document.querySelector( '#tab4' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le dernier élément.' );
      t.end();
    });
});


// test 9
test( '9| Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur un onglet déplace le focus sur l’onglet précédent.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab2' )
    .key( 38 ) // `ArrowUp` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le premier élément.' );
      t.end();
    });
});


// test 10
test( '10| Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur le premier onglet déplace le focus sur le dernier onglet.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab1' )
    .key( 37 ) // `ArrowLeft` key
    .evaluate(() => {
      return document.querySelector( '#tab4' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le dernier élément.' );
      t.end();
    });
});


// test 11
test( '11| Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur un onglet déplace le focus sur l’onglet précédent.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab2' )
    .key( 37 ) // `ArrowLeft` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le premier élément.' );
      t.end();
    });
});


// test 12
test( '12| Une pression sur la touche « Flèche bas » lorsque le focus est positionné sur le dernier onglet déplace le focus sur le premier onglet.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab4' )
    .key( 40 ) // `ArrowDown` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le premier élément.' );
      t.end();
    });
});


// test 13
test( '13| Une pression sur la touche « Flèche bas» lorsque le focus est positionné sur un onglet déplace le focus sur l’onglet suivant.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '[role="tab"]' )
    .key( 40 ) // `ArrowDown` key
    .evaluate(() => {
      return document.querySelector( '#tab2' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le second élément.' );
      t.end();
    });
});


// test 14
test( '14| Une pression sur la touche « Flèche droite » lorsque le focus est positionné sur le dernier onglet déplace le focus sur le premier onglet.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab4' )
    .key( 39 ) // `ArrowRight` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le premier élément.' );
      t.end();
    });
});


// test 15
test( '15| Une pression sur la touche « Flèche droite» lorsque le focus est positionné sur un onglet déplace le focus sur l’onglet suivant.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '[role="tab"]' )
    .key( 39 ) // `ArrowRight` key
    .evaluate(() => {
      return document.querySelector( '#tab2' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le second élément.' );
      t.end();
    });
});


// test 16
test( '16| Une pression sur la combinaison de touches « Ctrl+Flèche haut » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’onglet de ce panneau.', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '[role="tab"]' ) // open tab first
    .focus( '[role="tabpanel"] a' )
    .key({
      code: 38, // `ArrowUp` key
      ctrl: true
    })
    .evaluate(() => {
      return document.querySelector( '[role="tab"]' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le premier onglet.' );
      t.end();
    });
});


// test 17
test( '17| Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément du premier panneau déplace le focus sur le dernier onglet.', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '[role="tab"]' ) // open tab first
    .focus( '[role="tabpanel"] a' )
    .key({
      code: 33, // `PageUp` key
      ctrl: true
    })
    .evaluate(() => {
      return document.querySelector( '#tab4' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le dernier onglet.' );
      t.end();
    });
});


// test 18
test( '18| Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’onglet précédent.', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab2' ) // open tab first
    .focus( '#tabpanel2 a' )
    .key({
      code: 33, // `PageUp` key
      ctrl: true
    })
    .evaluate(() => {
      return document.querySelector( '#tab1' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le premier onglet.' );
      t.end();
    });
});


// test 19
test( '19| Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément du dernier panneau déplace le focus sur le premier onglet.', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab4' ) // open tab first
    .focus( '#tabpanel4 a' )
    .key({
      code: 34, // `PageDown` key
      ctrl: true
    })
    .evaluate(() => {
      return document.querySelector( '#tab1' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le premier onglet.' );
      t.end();
    });
});


// test 20
test( '20| Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’onglet suivant.', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '[role="tab"]' ) // open tab first
    .focus( '[role="tabpanel"] a' )
    .key({
      code: 34, // `PageDown` key
      ctrl: true
    })
    .evaluate(() => {
      return document.querySelector( '#tab2' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le second onglet.' );
      t.end();
    });
});


// test 21
test( '21| A l’ouverture d’un panneau, la fonction de callback correspondante doit être appelée.', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab2' ) // open panel
    .evaluate(() => {
      return document.querySelector( '#tab2' ).dataset.openCB;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, 'true', 'La fonction de callback doit être exécutée.' );
      t.end();
    });
});


// test 22
test( '22| A la fermeture d’un panneau, la fonction de callback correspondante doit être appelée.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab2' )
    .click( '#tab2' ) // open panel
    .evaluate(() => {
      return document.querySelector( '#tab1' ).dataset.closeCB;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, 'true', 'La fonction de callback doit être exécutée.' );
      t.end();
    });
});
