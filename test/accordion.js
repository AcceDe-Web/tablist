/* jshint esnext:true, node:true  */
/* globals require */

'use strict';

const test        = require( 'tape' );
const loadBrowser = require( './tools/browser' );


// test 1
test( '1| L’entête de panneau ayant le focus est le seul à avoir la valeur « true » pour l’attribut « aria-selected ».', ( assert ) => {
  loadBrowser() // open browser
    .focus( '[role="tab"]' )
    .evaluate(() => {
      return {
        ariaSelected: document.activeElement.getAttribute( 'aria-selected' ),
        selectedItems: document.querySelectorAll( '[aria-selected="true"]' ).length
      };
    })
    .end() // close browser
    .then(( actual ) => {
      assert.equal( actual.ariaSelected, 'true', 'Les deux doivent avoir la valeur « true ».' );
      assert.equal( actual.selectedItems, 1, 'Les deux doivent avoir la valeur « 1 ».' );
      assert.end();
    });
});


// test 2
test( '2| L’entête de panneau ayant le focus est le seul à avoir la valeur « 0 » pour l’attribut « tabindex ».', ( assert ) => {
  loadBrowser() // open browser
    .focus( '[role="tab"]' )
    .evaluate(() => {
      return {
        tabindex: document.activeElement.getAttribute( 'tabindex' ),
        tabindexedItems: document.querySelectorAll( '[role="tab"][tabindex="0"]' ).length
      };
    })
    .end() // close browser
    .then(( actual ) => {
      assert.equal( actual.tabindex, '0', 'Les deux doivent avoir la valeur « 0 ».' );
      assert.equal( actual.tabindexedItems, 1, 'Les deux doivent avoir la valeur « 1 ».' );
      assert.end();
    });
});


// test 3
test( '3| Les entêtes de panneau n’ayant pas le focus ont la valeur « false » pour l’attribut « aria-selected ».', ( assert ) => {
  loadBrowser() // open browser
    .evaluate(() => {
      return {
        actual: document.querySelectorAll( '[aria-selected="false"]' ).length,
        expected: document.querySelectorAll( '[role="tab"]' ).length
      };
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results.actual, results.expected, 'Aucune entête n’a le focus au chargement. On doit donc retrouver toutes les entêtes non sélectionnées.' );
      assert.end();
    });
});


// test 4
test( '4| Les entêtes de panneau n’ayant pas le focus ont la valeur « -1 » pour l’attribut « tabindex ».', ( assert ) => {
  loadBrowser() // open browser
    .evaluate(() => {
      return {
        first: document.querySelector( '[role="tab"]' ).getAttribute( 'tabindex' ) === '0',
        others: document.querySelectorAll( '[role="tab"][tabindex="-1"]' ).length
      };
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results.first, true, 'Seul le premier entête est focusable (tabindex à 0).' );
      assert.equal( results.others, 3, 'Tous les autres entêtes ne sont pas focusables (tabindex à -1)' );
      assert.end();
    });
});


// test 5
test( '5| Un « Click » sur un entête de panneau dont la valeur l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', ( assert ) => {
  loadBrowser() // open browser
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
      assert.equal( results.ariaExpanded, 'true', 'L’élément doit être actif.' );
      assert.equal( results.ariaHidden, 'false', 'L’élément doit être affiché.' );
      assert.end();
    });
});


// test 6
test( '6| Une pression sur la touche « Entrée » sur un entête de panneau dont la valeur l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', ( assert ) => {
  loadBrowser() // open browser
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
      assert.equal( results.ariaExpanded, 'true', 'L’élément doit être actif.' );
      assert.equal( results.ariaHidden, 'false', 'L’élément doit être affiché.' );
      assert.end();
    });
});


// test 7
test( '7| Une pression sur la touche « Espace » sur un entête de panneau dont la valeur l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', ( assert ) => {
  loadBrowser() // open browser
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
      assert.equal( results.ariaExpanded, 'true', 'L’élément doit être actif.' );
      assert.equal( results.ariaHidden, 'false', 'L’élément doit être affiché.' );
      assert.end();
    });
});


// test 8
test( '8| Un « Click » sur un entête de panneau dont la valeur l’attribut « aria-expanded » est à « true » modifie la valeur de cet attribut en la passant à « false ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « false » à « true ».', ( assert ) => {
  loadBrowser() // open browser
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
      assert.equal( results.ariaExpanded, 'false', 'L’élément doit être inactif.' );
      assert.equal( results.ariaHidden, 'true', 'L’élément doit être masqué.' );
      assert.end();
    });
});


// test 9
test( '9| Une pression sur la touche « Entrée » sur un entête de panneau dont la valeur l’attribut « aria-expanded » est à « true » modifie la valeur de cet attribut en la passant à « false ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « false » à « true ».', ( assert ) => {
  loadBrowser() // open browser
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
      assert.equal( results.ariaExpanded, 'false', 'L’élément doit être inactif.' );
      assert.equal( results.ariaHidden, 'true', 'L’élément doit être masqué.' );
      assert.end();
    });
});


// test 10
test( '10| Une pression sur la touche « Espace » sur un entête de panneau dont la valeur l’attribut « aria-expanded » est à « true » modifie la valeur de cet attribut en la passant à « false ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « false » à « true ».', ( assert ) => {
  loadBrowser() // open browser
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
      assert.equal( results.ariaExpanded, 'false', 'L’élément doit être inactif.' );
      assert.equal( results.ariaHidden, 'true', 'L’élément doit être masqué.' );
      assert.end();
    });
});


// test 11
test( '11| Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur le premier entête de panneau déplace le focus sur le dernier entête de panneau.', ( assert ) => {
  loadBrowser() // open browser
    .focus( '#tab1' )
    .key( 38 ) // `ArrowUp` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]:last-of-type' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, true, 'L’élément actif doit être le dernier élément.' );
      assert.end();
    });
});


// test 12
test( '12| Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau précédent.', ( assert ) => {
  loadBrowser() // open browser
    .focus( '#tab2' )
    .key( 38 ) // `ArrowUp` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, true, 'L’élément actif doit être le premier élément.' );
      assert.end();
    });
});


// test 13
test( '13| Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur le premier entête de panneau déplace le focus sur le dernier entête de panneau.', ( assert ) => {
  loadBrowser() // open browser
    .focus( '#tab1' )
    .key( 37 ) // `ArrowLeft` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]:last-of-type' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, true, 'L’élément actif doit être le dernier élément.' );
      assert.end();
    });
});


// test 14
test( '14| Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau précédent.', ( assert ) => {
  loadBrowser() // open browser
    .focus( '#tab2' )
    .key( 37 ) // `ArrowLeft` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, true, 'L’élément actif doit être le premier élément.' );
      assert.end();
    });
});


// test 15
test( '15| Une pression sur la touche « Flèche bas » lorsque le focus est positionné sur le dernier entête de panneau déplace le focus sur le premier entête de panneau.', ( assert ) => {
  loadBrowser() // open browser
    .focus( '[role="tab"]:last-of-type' )
    .key( 40 ) // `ArrowDown` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, true, 'L’élément actif doit être le premier élément.' );
      assert.end();
    });
});


// test 16
test( '16| Une pression sur la touche « Flèche bas » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau suivant.', ( assert ) => {
  loadBrowser() // open browser
    .focus( '[role="tab"]' )
    .key( 40 ) // `ArrowDown` key
    .evaluate(() => {
      return document.querySelector( '#tab2' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, true, 'L’élément actif doit être le second élément.' );
      assert.end();
    });
});



// test 17
test( '17| Une pression sur la touche « Flèche droite » lorsque le focus est positionné sur le dernier entête de panneau déplace le focus sur le premier entête de panneau.', ( assert ) => {
  loadBrowser() // open browser
    .focus( '[role="tab"]:last-of-type' )
    .key( 39 ) // `ArrowRight` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, true, 'L’élément actif doit être le premier élément.' );
      assert.end();
    });
});


// test 18
test( '18| Une pression sur la touche « Flèche droite » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau suivant.', ( assert ) => {
  loadBrowser() // open browser
    .focus( '[role="tab"]' )
    .key( 39 ) // `ArrowRight` key
    .evaluate(() => {
      return document.querySelector( '#tab2' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, true, 'L’élément actif doit être le second élément.' );
      assert.end();
    });
});


// test 19
test( '19| Une pression sur la combinaison de touches « Ctrl+Flèche haut » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de ce panneau.', ( assert ) => {
  loadBrowser() // open browser
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
      assert.equal( results, true, 'L’élément actif doit être le premier entête de panneau.' );
      assert.end();
    });
});


// test 20
test( '20| Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément du premier panneau déplace le focus sur le dernier entête de panneau.', ( assert ) => {
  loadBrowser() // open browser
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
      assert.equal( results, true, 'L’élément actif doit être le dernier entête de panneau.' );
      assert.end();
    });
});


// test 21
test( '21| Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de panneau précédent.', ( assert ) => {
  loadBrowser() // open browser
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
      assert.equal( results, true, 'L’élément actif doit être le premier entête de panneau.' );
      assert.end();
    });
});


// test 22
test( '22| Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément du dernier panneau déplace le focus sur le premier entête de panneau.', ( assert ) => {
  loadBrowser() // open browser
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
      assert.equal( results, true, 'L’élément actif doit être le premier entête de panneau.' );
      assert.end();
    });
});


// test 23
test( '23| Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de panneau suivant.', ( assert ) => {
  loadBrowser() // open browser
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
      assert.equal( results, true, 'L’élément actif doit être le second entête de panneau.' );
      assert.end();
    });
});


// test 24
test( '24| Une pression sur la touche « Origine », lorsque le focus est positionné sur un entête de panneau, déplace le focus sur le premier entête de panneau.', ( assert ) => {
  loadBrowser() // open browser
    .focus( '#tab3' )
    .key( 36 ) // `home` key
    .evaluate(() => {
      return document.querySelector( '#tab1' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, true, 'L’élément actif doit être le premier entête de panneau.' );
      assert.end();
    });
});


// test 25
test( '25| Une pression sur la touche « Fin », lorsque le focus est positionné sur un entête de panneau, déplace le focus sur le dernier entête de panneau.', ( assert ) => {
  loadBrowser() // open browser
    .focus( '#tab2' )
    .key( 35 ) // `end` key
    .evaluate(() => {
      return document.querySelector( '[role="tab"]:last-of-type' ) === document.activeElement;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, true, 'L’élément actif doit être le dernier entête de panneau.' );
      assert.end();
    });
});


// test 26
test( '26| A l’ouverture d’un panneau, la fonction de callback correspondante doit être appelée.', ( assert ) => {
  loadBrowser() // open browser
    .click( '#tab2' ) // open panel
    .evaluate(() => {
      return document.querySelector( '#tab2' ).dataset.openCB;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, 'true', 'La fonction de callback doit être exécutée.' );
      assert.end();
    });
});


// test 27
test( '27| A la fermeture d’un panneau, la fonction de callback correspondante doit être appelée.', ( assert ) => {
  loadBrowser() // open browser
    .click( '#tab2' ) // open panel
    .click( '#tab2' ) // close panel
    .evaluate(() => {
      return document.querySelector( '#tab2' ).dataset.closeCB;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, 'true', 'La fonction de callback doit être exécutée.' );
      assert.end();
    });
});


// test 28
test( '28| A la fermeture de tous les panneaux, la fonction de callback correspondante doit être appelée.', ( assert ) => {
  loadBrowser() // open browser
    .click( '#tab1' ) // open panel
    .click( '#tab2' ) // open panel
    .click( '#tab3' ) // open panel
    .evaluate(() => {

      // close all tabs
      window.tablist.closeAll();

      return document.querySelector( '#tab1' ).dataset.closeAllCB === 'true' &&
             document.querySelector( '#tab2' ).dataset.closeAllCB === 'true' &&
             document.querySelector( '#tab3' ).dataset.closeAllCB === 'true' &&
             !document.querySelector( '#tab4' ).dataset.closeAllCB;
    })
    .end() // close browser
    .then(( results ) => {
      assert.equal( results, true, 'La fonction de callback doit être exécutée.' );
      assert.end();
    });
});
