/* eslint-env node */
'use strict';

const test = require( 'tape' );
const puppeteer = require( 'puppeteer' );
const path = `file://${__dirname}/tab.html`;

let browser;
let page;

// Label test suite in output
test( '-------------------------------', async t => {
  t.comment( 'Running *Tab* test suite.' );
  t.comment( '-------------------------------' );

  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto( path );

  t.end();
});


// test 1
test( '1| L’onglet ayant le focus est le seul à avoir la valeur « true » pour l’attribut « aria-selected ».', async t => {
  await page.reload();
  await page.focus( '[role="tab"]' );

  const result = await page.evaluate(() => {
    return {
      ariaSelected: document.activeElement.getAttribute( 'aria-selected' ),
      selectedItems: document.querySelectorAll( '[aria-selected="true"]' ).length
    };
  });


  t.equal( result.ariaSelected, 'true', '« aria-selected » doit valoir « true ».' );
  t.equal( result.selectedItems, 1, '« 1 » seul élément doit avoir un « aria-selected » à « true ».' );
  t.end();
});

// test 2
test( '2| L’onglet ayant le focus est le seul à avoir la valeur « 0 » pour l’attribut « tabindex ».', async t => {
  await page.reload();
  await page.focus( '[role="tab"]' );

  const result = await page.evaluate(() => {
    return {
      tabindex: document.activeElement.getAttribute( 'tabindex' ),
      tabindexedItems: document.querySelectorAll( '[role="tab"][tabindex="0"]' ).length
    };
  });

  t.equal( result.tabindex, '0', '« tabindex » doit valoir « 0 ».' );
  t.equal( result.tabindexedItems, 1, '« 1 » seul élément doit avoir un « tabindex » à « 0 ».' );
  t.end();
});


// test 3
test( '3| Le panneau associé à l’onglet ayant le focus est le seul à avoir la valeur « false » pour l’attribut « aria-hidden ».', async t => {
  await page.reload();
  await page.click( '#tab2' );

  const result = await page.evaluate(() => {
    const panels = Array.from( document.querySelectorAll( '[role="tabpanel"]' ));
    const selected = [];

    panels.forEach( panel => {
      if ( panel.getAttribute( 'aria-hidden' ) === 'false' ) {
        selected.push( panel );
      }
    });

    return selected.length === 1 && selected[ 0 ].id === 'tabpanel2';
  });

  t.equal( result, true, 'Seul un panneau doit avoir l’attribut « aria-hidden » qui vaut « false ».' );
  t.end();
});

// test 4
test( '4| Les onglets n’ayant pas le focus ont la valeur « false » pour l’attribut « aria-selected ».', async t => {
  await page.reload();

  const result = await page.evaluate(() => {
    return {
      actual: document.querySelectorAll( '[aria-selected="true"]' ).length,
      expected: 0
    };
  });

  t.equal( result.actual, result.expected, 'Aucune onglet n’a le focus au chargement. On doit donc retrouver tous les entêtes non sélectionnés.' );
  t.end();
});


// test 5
test( '5| Les onglets n’ayant pas le focus ont la valeur « -1 » pour l’attribut « tabindex ».', async t => {
  await page.reload();

  const result = await page.evaluate(() => {
    return {
      first: document.querySelector( '[role="tab"]' ).getAttribute( 'tabindex' ) === '0',
      others: document.querySelectorAll( '[role="tab"][tabindex="-1"]' ).length
    };
  });

  t.equal( result.first, true, 'Seul le premier onglet est focusable (« tabindex » à « 0 »).' );
  t.equal( result.others, 3, 'Tous les autres onglets ne sont pas focusables (« tabindex » à « -1 »)' );
  t.end();
});


// test 6
test( '6| Un « Click » sur un onglet dont la valeur l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', async t => {
  await page.reload();
  await page.click( '#tab2' );

  const result = await page.evaluate(() => {
    const tab = document.getElementById( 'tab2' );

    return {
      ariaExpanded: tab.getAttribute( 'aria-expanded' ),
      ariaHidden: document.querySelector( '#tabpanel2' ).getAttribute( 'aria-hidden' )
    };
  });

  t.equal( result.ariaExpanded, 'true', 'L’élément doit être actif.' );
  t.equal( result.ariaHidden, 'false', 'L’élément doit être affiché.' );
  t.end();
});


// test 7
test( '7| Les panneaux associés aux onglets n’ayant pas le focus ont la valeur « true » pour l’attribut « aria-hidden »', async t => {
  await page.reload();
  await page.click( '#tab2' );

  const result = await page.evaluate(() => {
    const panels = Array.from( document.querySelectorAll( '[role="tabpanel"]' ));
    const selected = [];

    panels.forEach( panel => {
      if ( panel.getAttribute( 'aria-hidden' ) === 'true' ) {
        selected.push( panel );
      }
    });

    return selected.length === 3;
  });

  t.equal( result, true, 'Tous les panneaux sauf 1 doivent avoir l’attribut « aria-hidden » qui vaut « true ».' );
  t.end();
});


// test 8
test( '8| Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur le premier onglet déplace le focus sur le dernier onglet.', async t => {
  await page.reload();
  await page.focus( '#tab1' );
  await page.keyboard.press( 'ArrowUp' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab4' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le dernier élément.' );
  t.end();
});


// test 9
test( '9| Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur un onglet déplace le focus sur l’onglet précédent.', async t => {
  await page.reload();
  await page.focus( '#tab2' );
  await page.keyboard.press( 'ArrowUp' );

  const result = await page.evaluate(() => {
    return document.querySelector( '[role="tab"]' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier élément.' );
  t.end();
});


// test 10
test( '10| Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur le premier onglet déplace le focus sur le dernier onglet.', async t => {
  await page.reload();
  await page.focus( '#tab1' );
  await page.keyboard.press( 'ArrowLeft' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab4' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le dernier élément.' );
  t.end();
});


// test 11
test( '11| Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur un onglet déplace le focus sur l’onglet précédent.', async t => {
  await page.reload();
  await page.focus( '#tab2' );
  await page.keyboard.press( 'ArrowLeft' );

  const result = await page.evaluate(() => {
    return document.querySelector( '[role="tab"]' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier élément.' );
  t.end();
});


// test 12
test( '12| Une pression sur la touche « Flèche bas » lorsque le focus est positionné sur le dernier onglet déplace le focus sur le premier onglet.', async t => {
  await page.reload();
  await page.focus( '#tab4' );
  await page.keyboard.press( 'ArrowDown' );

  const result = await page.evaluate(() => {
    return document.querySelector( '[role="tab"]' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier élément.' );
  t.end();
});


// test 13
test( '13| Une pression sur la touche « Flèche bas» lorsque le focus est positionné sur un onglet déplace le focus sur l’onglet suivant.', async t => {
  await page.reload();
  await page.focus( '[role="tab"]' );
  await page.keyboard.press( 'ArrowDown' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab2' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le second élément.' );
  t.end();
});


// test 14
test( '14| Une pression sur la touche « Flèche droite » lorsque le focus est positionné sur le dernier onglet déplace le focus sur le premier onglet.', async t => {
  await page.reload();
  await page.focus( '#tab4' );
  await page.keyboard.press( 'ArrowRight' );

  const result = await page.evaluate(() => {
    return document.querySelector( '[role="tab"]' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier élément.' );
  t.end();
});


// test 15
test( '15| Une pression sur la touche « Flèche droite» lorsque le focus est positionné sur un onglet déplace le focus sur l’onglet suivant.', async t => {
  await page.reload();
  await page.focus( '[role="tab"]' );
  await page.keyboard.press( 'ArrowRight' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab2' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le second élément.' );
  t.end();
});


// test 16
test( '16| Une pression sur la combinaison de touches « Ctrl+Flèche haut » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’onglet de ce panneau.', async t => {
  await page.reload();
  await page.click( '[role="tab"]' );
  await page.focus( '[role="tabpanel"] a' );
  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'ArrowUp' );
  await page.keyboard.up( 'Control' );

  const result = await page.evaluate(() => {
    return document.querySelector( '[role="tab"]' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier onglet.' );
  t.end();
});


// test 17
test( '17| Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément du premier panneau déplace le focus sur le dernier onglet.', async t => {
  await page.reload();
  await page.click( '[role="tab"]' );
  await page.focus( '[role="tabpanel"] a' );
  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageUp' );
  await page.keyboard.up( 'Control' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab4' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le dernier onglet.' );
  t.end();
});


// test 18
test( '18| Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’onglet précédent.', async t => {
  await page.reload();
  await page.click( '#tab2' );
  await page.focus( '#tabpanel2 a' );
  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageUp' );
  await page.keyboard.up( 'Control' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab1' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier onglet.' );
  t.end();
});


// test 19
test( '19| Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément du dernier panneau déplace le focus sur le premier onglet.', async t => {
  await page.reload();
  await page.click( '#tab4' );
  await page.focus( '#tabpanel4 a' );
  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageDown' );
  await page.keyboard.up( 'Control' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab1' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le premier onglet.' );
  t.end();
});


// test 20
test( '20| Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’onglet suivant.', async t => {
  await page.reload();
  await page.click( '[role="tab"]' );
  await page.focus( '[role="tabpanel"] a' );
  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageDown' );
  await page.keyboard.up( 'Control' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab2' ) === document.activeElement;
  });

  t.equal( result, true, 'L’élément actif doit être le second onglet.' );
  t.end();
});


// test 21
test( '21| A l’ouverture d’un panneau, la fonction de callback correspondante doit être appelée.', async t => {
  await page.reload();
  await page.click( '#tab2' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab2' ).dataset.openCB;
  });

  t.equal( result, 'true', 'La fonction de callback doit être exécutée.' );
  t.end();
});


// test 22
test( '22| A la fermeture d’un panneau, la fonction de callback correspondante doit être appelée.', async t => {
  await page.reload();
  await page.focus( '#tab2' );
  await page.click( '#tab2' );

  const result = await page.evaluate(() => {
    return document.querySelector( '#tab1' ).dataset.closeCB;
  });

  t.equal( result, 'true', 'La fonction de callback doit être exécutée.' );
  t.end();
});

test.onFinish(() => browser.close());
