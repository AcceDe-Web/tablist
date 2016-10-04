/* jshint esnext:true, node:true  */
/* globals require, __dirname */

'use strict';

const test        = require( 'tape' );
const loadBrowser = require( './tools/browser' );
const path        = 'file://' + __dirname + '/accordion-not-multiselectable.html';

// Label test suite in output
test( '-------------------------------', ( t ) => {
  t.comment( 'Running *Accordion* [multiselectable="false"] test suite.' );
  t.comment( '-------------------------------' );
  t.end();
});

// test 1
test( '1| L’entête de panneau ayant le focus est le seul à avoir la valeur « true » pour l’attribut « aria-selected ».', ( t ) => {
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
test( '2| L’entête de panneau ayant le focus est le seul à avoir la valeur « 0 » pour l’attribut « tabindex ».', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '[role="tab"]' )
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
test( '3| Les entêtes de panneau n’ayant pas le focus ont la valeur « false » pour l’attribut « aria-selected ».', ( t ) => {
  loadBrowser( path ) // open browser
    .evaluate(() => {
      return {
        actual: document.querySelectorAll( '[aria-selected="false"]' ).length,
        expected: document.querySelectorAll( '[role="tab"]' ).length
      };
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results.actual, results.expected, 'Aucune entête n’a le focus au chargement. On doit donc retrouver toutes les entêtes non sélectionnées.' );
      t.end();
    });
});


// test 4
test( '4| Les entêtes de panneau n’ayant pas le focus ont la valeur « -1 » pour l’attribut « tabindex ».', ( t ) => {
  loadBrowser( path ) // open browser
    .evaluate(() => {
      return {
        first: document.querySelector( '[role="tab"]' ).getAttribute( 'tabindex' ) === '0',
        others: document.querySelectorAll( '[role="tab"][tabindex="-1"]' ).length
      };
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results.first, true, 'Seul le premier entête est focusable (« tabindex » à « 0 »).' );
      t.equal( results.others, 3, 'Tous les autres entêtes ne sont pas focusables (« tabindex » à « -1 »)' );
      t.end();
    });
});


// test 5
test( '5| Un « Click » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab2' )
    .evaluate(() => {
      var tab = document.getElementById( 'tab2' );

      return {
        ariaExpanded: tab.getAttribute( 'aria-expanded' ),
        ariaHidden: document.querySelector( '[role="tabpanel"][aria-labelledby="'+ tab.id +'"]' ).getAttribute( 'aria-hidden' )
      };
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results.ariaExpanded, 'true', 'L’élément doit être actif.' );
      t.equal( results.ariaHidden, 'false', 'L’élément doit être affiché.' );
      t.end();
    });
});


// test 6
test( '6| Une pression sur la touche « Entrée » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab2' )
    .key( 13 ) // `Enter` key
    .evaluate(() => {
      var tab = document.getElementById( 'tab2' );

      return {
        ariaExpanded: tab.getAttribute( 'aria-expanded' ),
        ariaHidden: document.querySelector( '[role="tabpanel"][aria-labelledby="'+ tab.id +'"]' ).getAttribute( 'aria-hidden' )
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
test( '7| Une pression sur la touche « Espace » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab2' )
    .key( 32 ) // `Space` key
    .evaluate(() => {
      var tab = document.getElementById( 'tab2' );

      return {
        ariaExpanded: tab.getAttribute( 'aria-expanded' ),
        ariaHidden: document.querySelector( '[role="tabpanel"][aria-labelledby="'+ tab.id +'"]' ).getAttribute( 'aria-hidden' )
      };
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results.ariaExpanded, 'true', 'L’élément doit être actif.' );
      t.equal( results.ariaHidden, 'false', 'L’élément doit être affiché.' );
      t.end();
    });
});


// test 8
test( '8| Un « Click » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « true » modifie la valeur de cet attribut en la passant à « false ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « false » à « true ».', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab2' )
    .click( '#tab2[aria-expanded="true"]' )
    .evaluate(() => {
      var tab = document.getElementById( 'tab2' );

      return {
        ariaExpanded: tab.getAttribute( 'aria-expanded' ),
        ariaHidden: document.querySelector( '[role="tabpanel"][aria-labelledby="'+ tab.id +'"]' ).getAttribute( 'aria-hidden' )
      };
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results.ariaExpanded, 'false', 'L’élément doit être inactif.' );
      t.equal( results.ariaHidden, 'true', 'L’élément doit être masqué.' );
      t.end();
    });
});


// test 9
test( '9| Une pression sur la touche « Entrée » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « true » modifie la valeur de cet attribut en la passant à « false ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « false » à « true ».', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab2' )
    .focus( '#tab2[aria-expanded="true"]' )
    .key( 13 ) // `Enter` key
    .evaluate(() => {
      var tab = document.getElementById( 'tab2' );

      return {
        ariaExpanded: tab.getAttribute( 'aria-expanded' ),
        ariaHidden: document.querySelector( '[role="tabpanel"][aria-labelledby="'+ tab.id +'"]' ).getAttribute( 'aria-hidden' )
      };
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results.ariaExpanded, 'false', 'L’élément doit être inactif.' );
      t.equal( results.ariaHidden, 'true', 'L’élément doit être masqué.' );
      t.end();
    });
});


// test 10
test( '10| Une pression sur la touche « Espace » sur un entête de panneau dont la valeur de l’attribut « aria-expanded » est à « true » modifie la valeur de cet attribut en la passant à « false ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « false » à « true ».', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab2' )
    .focus( '#tab2[aria-expanded="true"]' )
    .key( 32 ) // `Space` key
    .evaluate(() => {
      var tab = document.getElementById( 'tab2' );

      return {
        ariaExpanded: tab.getAttribute( 'aria-expanded' ),
        ariaHidden: document.querySelector( '[role="tabpanel"][aria-labelledby="'+ tab.id +'"]' ).getAttribute( 'aria-hidden' )
      };
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results.ariaExpanded, 'false', 'L’élément doit être inactif.' );
      t.equal( results.ariaHidden, 'true', 'L’élément doit être masqué.' );
      t.end();
    });
});


// test 11
test( '11| Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur le premier entête de panneau déplace le focus sur le dernier entête de panneau.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab1' )
    .key( 38 ) // `ArrowUp` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]:last-of-type' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le dernier élément.' );
      t.end();
    });
});


// test 12
test( '12| Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau précédent.', ( t ) => {
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


// test 13
test( '13| Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur le premier entête de panneau déplace le focus sur le dernier entête de panneau.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab1' )
    .key( 37 ) // `ArrowLeft` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]:last-of-type' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le dernier élément.' );
      t.end();
    });
});


// test 14
test( '14| Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau précédent.', ( t ) => {
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


// test 15
test( '15| Une pression sur la touche « Flèche bas » lorsque le focus est positionné sur le dernier entête de panneau déplace le focus sur le premier entête de panneau.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '[role="tab"]:last-of-type' )
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


// test 16
test( '16| Une pression sur la touche « Flèche bas » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau suivant.', ( t ) => {
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



// test 17
test( '17| Une pression sur la touche « Flèche droite » lorsque le focus est positionné sur le dernier entête de panneau déplace le focus sur le premier entête de panneau.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '[role="tab"]:last-of-type' )
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


// test 18
test( '18| Une pression sur la touche « Flèche droite » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau suivant.', ( t ) => {
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


// test 19
test( '19| Une pression sur la combinaison de touches « Ctrl+Flèche haut » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de ce panneau.', ( t ) => {
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
      t.equal( results, true, 'L’élément actif doit être le premier entête de panneau.' );
      t.end();
    });
});


// test 20
test( '20| Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément du premier panneau déplace le focus sur le dernier entête de panneau.', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '[role="tab"]' ) // open tab first
    .focus( '[role="tabpanel"] a' )
    .key({
      code: 33, // `PageUp` key
      ctrl: true
    })
    .evaluate(() => {
      return document.querySelector( '[role="tab"]:last-of-type' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le dernier entête de panneau.' );
      t.end();
    });
});


// test 21
test( '21| Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de panneau précédent.', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab2' ) // open tab first
    .focus( '[aria-labelledby="tab2"] a' )
    .key({
      code: 33, // `PageUp` key
      ctrl: true
    })
    .evaluate(() => {
      return document.querySelector( '#tab1' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le premier entête de panneau.' );
      t.end();
    });
});


// test 22
test( '22| Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément du dernier panneau déplace le focus sur le premier entête de panneau.', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '[role="tab"]:last-of-type' ) // open tab first
    .focus( '[role="tabpanel"]:last-of-type a' )
    .key({
      code: 34, // `PageDown` key
      ctrl: true
    })
    .evaluate(() => {
      return document.querySelector( '#tab1' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le premier entête de panneau.' );
      t.end();
    });
});


// test 23
test( '23| Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de panneau suivant.', ( t ) => {
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
      t.equal( results, true, 'L’élément actif doit être le second entête de panneau.' );
      t.end();
    });
});


// test 24
test( '24| Une pression sur la touche « Origine », lorsque le focus est positionné sur un entête de panneau, déplace le focus sur le premier entête de panneau.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab3' )
    .key( 36 ) // `home` key
    .evaluate(() => {
      return document.querySelector( '#tab1' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le premier entête de panneau.' );
      t.end();
    });
});


// test 25
test( '25| Une pression sur la touche « Fin », lorsque le focus est positionné sur un entête de panneau, déplace le focus sur le dernier entête de panneau.', ( t ) => {
  loadBrowser( path ) // open browser
    .focus( '#tab2' )
    .key( 35 ) // `end` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]:last-of-type' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'L’élément actif doit être le dernier entête de panneau.' );
      t.end();
    });
});


// test 26
test( '26| A l’ouverture d’un panneau, la fonction de callback correspondante doit être appelée.', ( t ) => {
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


// test 27
test( '27| A la fermeture d’un panneau, la fonction de callback correspondante doit être appelée.', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab2' ) // open panel
    .click( '#tab2' ) // close panel
    .evaluate(() => {
      return document.querySelector( '#tab2' ).dataset.closeCB;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, 'true', 'La fonction de callback doit être exécutée.' );
      t.end();
    });
});


// test 28
test( '28| A la fermeture de tous les panneaux, la fonction de callback correspondante doit être appelée.', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab1' ) // open panel
    .click( '#tab2' ) // open panel
    .click( '#tab3' ) // open panel
    .evaluate(() => {

      // close all tabs
      window.tablist.closeAll();

      return !document.querySelector( '#tab1' ).dataset.closeAllCB &&
             !document.querySelector( '#tab2' ).dataset.closeAllCB &&
             document.querySelector( '#tab3' ).dataset.closeAllCB === 'true' &&
             !document.querySelector( '#tab4' ).dataset.closeAllCB;
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results, true, 'La fonction de callback doit être exécutée.' );
      t.end();
    });
});


// test 29
test( '29| Un « Click » sur une seconde entête de panneau ferme le précédent panneau ouvert', ( t ) => {
  loadBrowser( path ) // open browser
    .click( '#tab1' )
    .click( '#tab2' )
    .evaluate(() => {
      var tab1 = document.getElementById( 'tab1' ),
          tab2 = document.getElementById( 'tab2' );

      return {
        aria1Expanded: tab1.getAttribute( 'aria-expanded' ),
        aria1Hidden: document.querySelector( '[role="tabpanel"][aria-labelledby="'+ tab1.id +'"]' ).getAttribute( 'aria-hidden' ),
        aria1CB: tab1.dataset.closeCB,
        aria2Expanded: tab2.getAttribute( 'aria-expanded' ),
        aria2Hidden: document.querySelector( '[role="tabpanel"][aria-labelledby="'+ tab2.id +'"]' ).getAttribute( 'aria-hidden' ),
        aria2CB: tab2.dataset.closeCB
      };
    })
    .end() // close browser
    .then(( results ) => {
      t.equal( results.aria1Expanded, 'false', 'L’élément précédent doit être inactif.' );
      t.equal( results.aria1Hidden, 'true', 'L’élément précédent doit être masqué.' );
      t.equal( results.aria1CB, 'true', 'La fonction de calback de fermeture doit être exécuté sur l’élément précédent.' );
      t.equal( results.aria2Expanded, 'true', 'L’élément cliqué doit être actif.' );
      t.equal( results.aria2Hidden, 'false', 'L’élément cliqué doit être affiché.' );
      t.equal( results.aria2CB, undefined, 'La fonction de calback de fermeture ne doit pas être exécuté sur L’élément cliqué.' );
      t.end();
    });
});
