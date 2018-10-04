/* eslint-env node */
'use strict';

const test = require( 'tape' );
const puppeteer = require( 'puppeteer' );
const path = {
  default: `file://${__dirname}/tab.html`,
  opened: `file://${__dirname}/tab-opened.html`
};

const createBrowser = async ( type = 'default' ) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto( path[ type ]);

  return [ browser, page ];
};

test( 'Mount', async t => {

  const [ browser, page ] = await createBrowser();

  const [[ firstIndex, ...indexes ], [ firstPanel, ... panels ], firstSelected ] = await page.evaluate(() => {
    const tabindexes = Array.from( document.querySelectorAll( '[role="tab"]' )).map( tab => {
      return tab.tabIndex;
    });

    const hidden = Array.from( document.querySelectorAll( '[role="tabpanel"]' )).map( tabpanel => {
      return tabpanel.getAttribute( 'aria-hidden' );
    });

    return [
      tabindexes,
      hidden,
      document.querySelector( '[role="tab"]' ).getAttribute( 'aria-selected' ) === 'true'
    ];
  });

  t.same( firstIndex, 0, 'Le premier élémnent « tab » a « [tabindex="0"] ».' );
  t.true( firstSelected, 'Le premier élément « tab » a « [aria-selected="true"] ».' );
  t.same( indexes.join(), '-1,-1,-1', 'Les autres élémnents « tab » ont « [tabindex="-1"] ».' );

  t.same( firstPanel, 'false', 'Le premier élémnent « tabpanel » a « [aria-hidden="false"] ».' );
  t.same( panels.join(), 'true,true,true', 'Les autres élémnents « tabpanel » ont « [aria-hidden="true"] ».' );

  await browser.close();

  t.end();
});


test( 'Second tab opened by default', async t => {

  const [ browser, page ] = await createBrowser( 'opened' );

  const [ indexes, panels, secondSelected ] = await page.evaluate(() => {
    const tabindexes = Array.from( document.querySelectorAll( '[role="tab"]' )).map( tab => {
      return tab.tabIndex;
    });

    const hidden = Array.from( document.querySelectorAll( '[role="tabpanel"]' )).map( tabpanel => {
      return tabpanel.getAttribute( 'aria-hidden' );
    });

    return [
      tabindexes,
      hidden,
      document.querySelector( '[role="tab"]:nth-child(2)' ).getAttribute( 'aria-selected' ) === 'true'
    ];
  });

  t.same( indexes[ 1 ], 0, 'Le deuxième élément « tab » a « [tabindex="0"] ».' );
  t.true( secondSelected, 'Le deuxième élément « tab » a « [aria-selected="true"] ».' );
  t.same( indexes.join(), '-1,0,-1,-1', 'Les autres éléments « tab » ont « [tabindex="-1"] ».' );

  t.same( panels[ 1 ], 'false', 'Le deuxième élément « tabpanel » a « [aria-hidden="false"] ».' );
  t.same( panels.join(), 'true,false,true,true', 'Les autres éléments « tabpanel » ont « [aria-hidden="true"] ».' );

  await browser.close();

  t.end();
});

test( 'Focus', async t => {

  const [ browser, page ] = await createBrowser();

  await page.focus( '[role="tab"]:nth-child(2)' );

  const [ selected, selectedIndex, uniqueIndex, selectedCount, hiddenPanel, hiddenCount ] = await page.evaluate(() => {
    return [
      document.activeElement.getAttribute( 'aria-selected' ),
      document.activeElement.tabIndex,
      document.querySelectorAll( '[role="tab"][tabindex="0"]' ).length,
      document.querySelectorAll( '[aria-selected="true"]' ).length,
      document.getElementById( document.activeElement.getAttribute( 'aria-controls' )).getAttribute( 'aria-hidden' ),
      document.querySelectorAll( '[role="tabpanel"][aria-hidden="false"]' ).length,
    ];
  });

  t.same( selected, 'true', 'L’onglet focus a « [aria-selected="true"] »' );
  t.same( selectedIndex, 0, 'L’onglet focus a « [tabindex="0"] »' );
  t.same( uniqueIndex, 1, 'Seul l’onglet focus a « [tabindex="0"] »' );
  t.same( selectedCount, 1, 'Seul l’onglet focus a « [aria-selected] »' );
  t.same( hiddenPanel, 'false', 'Le panneau associé à l’onglet focus a « [aria-hidden="false"] »' );
  t.same( hiddenCount, 1, 'Seul le panneau associé à l’onglet focus a « [aria-hidden="false"] »' );

  await browser.close();

  t.end();
});

test( 'Click', async t => {

  const [ browser, page ] = await createBrowser();

  await page.click( '[role="tab"]:nth-child(4)' );

  const [ selected, selectedIndex, uniqueIndex, selectedCount, hiddenPanel, hiddenCount ] = await page.evaluate(() => {
    return [
      document.activeElement.getAttribute( 'aria-selected' ),
      document.activeElement.tabIndex,
      document.querySelectorAll( '[role="tab"][tabindex="0"]' ).length,
      document.querySelectorAll( '[aria-selected="true"]' ).length,
      document.getElementById( document.activeElement.getAttribute( 'aria-controls' )).getAttribute( 'aria-hidden' ),
      document.querySelectorAll( '[role="tabpanel"][aria-hidden="false"]' ).length,
    ];
  });

  t.same( selected, 'true', 'L’onglet cliqué a « [aria-selected="true"] »' );
  t.same( selectedIndex, 0, 'L’onglet cliqué a « [tabindex="0"] »' );
  t.same( uniqueIndex, 1, 'Seul l’onglet cliqué a « [tabindex="0"] »' );
  t.same( selectedCount, 1, 'Seul l’onglet cliqué a « [aria-selected] »' );
  t.same( hiddenPanel, 'false', 'Le panneau associé à l’onglet cliqué a « [aria-hidden="false"] »' );
  t.same( hiddenCount, 1, 'Seul le panneau associé à l’onglet cliqué a « [aria-hidden="false"] »' );

  await browser.close();

  t.end();
});

test( 'Tab navigation', async t => {

  const [ browser, page ] = await createBrowser();

  await page.focus( '[role="tab"]' );
  await page.keyboard.press( 'ArrowRight' );

  const [ focusSecond, current ] = await page.evaluate(() => {
    const secondTab = document.querySelector( '[role="tab"]:nth-child(2)' );
    const secondTabPanel = document.querySelector( '[role="tabpanel"]:nth-of-type(2)' );

    return [
      document.activeElement === secondTab,
      secondTab === window.tablist.current.tab && secondTabPanel === window.tablist.current.tabPanel
    ];
  });

  t.true( focusSecond, 'La touche « Flèche droite » focus l’onglet suivant' );

  await page.keyboard.press( 'ArrowLeft' );

  const focusFirst = await page.evaluate(() => {
    return document.activeElement === document.querySelector( '[role="tab"]' );
  });

  t.true( focusFirst, 'La touche « Flèche gauche » focus l’onglet précédent' );

  await page.keyboard.press( 'ArrowLeft' );

  const focusLast = await page.evaluate(() => {
    return document.activeElement === document.querySelector( '[role="tab"]:nth-child(4)' );
  });

  t.true( focusLast, 'La touche « Flèche gauche » focus le dernier onglet' );

  await page.keyboard.press( 'ArrowRight' );

  const focusRighFirst = await page.evaluate(() => {
    return document.activeElement === document.querySelector( '[role="tab"]' );
  });

  t.true( focusRighFirst, 'La touche « Flèche droite » focus le premier onglet' );

  await page.keyboard.press( 'ArrowRight' );
  await page.keyboard.press( 'ArrowRight' );

  const focusSkipDisabled = await page.evaluate(() => {
    return document.activeElement === document.querySelector( '[role="tab"]:nth-child(4)' );
  });

  t.true( focusSkipDisabled, 'La navigation saute les onglets « [disabled] »' );

  await page.keyboard.press( 'ArrowDown' );

  const focusDown = await page.evaluate(() => {
    return document.activeElement === document.querySelector( '[role="tab"]' );
  });

  t.true( focusDown, 'La touche « Flèche bas » focus le premier onglet' );

  await page.keyboard.press( 'ArrowDown' );
  await page.keyboard.press( 'ArrowUp' );

  const focusUp = await page.evaluate(() => {
    return document.activeElement === document.querySelector( '[role="tab"]' );
  });

  t.true( focusUp, 'La touche « Flèche haut » focus l’onglet précédent' );

  await page.keyboard.press( 'End' );

  const focusEnd = await page.evaluate(() => {
    return document.activeElement === document.querySelector( '[role="tab"]:last-child' );
  });

  t.true( focusEnd, 'La touche « Fin » focus le dernier onglet' );

  await page.keyboard.press( 'Home' );

  const focusHome = await page.evaluate(() => {
    return document.activeElement === document.querySelector( '[role="tab"]' );
  });

  t.true( focusHome, 'La touche « Début » focus le premier onglet' );

  t.true( current, 'La propriété « current » de tablist reflète les bons tab et tabPanel' );

  await browser.close();

  t.end();
});


test( 'Panel navigation', async t => {

  const [ browser, page ] = await createBrowser();

  await page.focus( '[role="tab"]:nth-child(2)' );
  await page.focus( '[aria-hidden="false"] a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'ArrowUp' );
  await page.keyboard.up( 'Control' );

  const crtlUp = await page.evaluate(() => {
    return document.querySelector( '[role="tab"]:nth-child(2)' ) === document.activeElement;
  });

  t.true( crtlUp, 'La combinaison « Ctrl + Flèche haut » focus l’onglet lié au panneau' );

  await page.focus( '[aria-hidden="false"] a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageUp' );
  await page.keyboard.up( 'Control' );

  const pageUp = await page.evaluate(() => {
    return document.querySelector( '[role="tab"]' ) === document.activeElement;
  });

  t.true( pageUp, 'La combinaison « Ctrl + Page précédente » focus l’onglet précédent' );

  await page.focus( '[role="tab"]:nth-child(2)' );
  await page.focus( '[aria-hidden="false"] a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageDown' );
  await page.keyboard.up( 'Control' );

  const pageDown = await page.evaluate(() => {
    return document.querySelector( '[role="tab"]:last-child' ) === document.activeElement;
  });

  t.true( pageDown, 'La combinaison « Ctrl + Page suivante » focus l’onglet suivant' );

  await page.focus( '[role="tab"]' );
  await page.focus( '[aria-hidden="false"] a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageUp' );
  await page.keyboard.up( 'Control' );

  const pageUpFirst = await page.evaluate(() => {
    return document.querySelector( '[role="tab"]:last-child' ) === document.activeElement;
  });

  t.true( pageUpFirst, 'La combinaison « Ctrl + Page précédente » focus le dernier onglet depuis le premier panneau' );

  await page.focus( '[aria-hidden="false"] a' );

  await page.keyboard.down( 'Control' );
  await page.keyboard.press( 'PageDown' );
  await page.keyboard.up( 'Control' );

  const pageDownFirst = await page.evaluate(() => {
    return document.querySelector( '[role="tab"]' ) === document.activeElement;
  });

  t.true( pageDownFirst, 'La combinaison « Ctrl + Page suivante » focus le premier onglet depuis le dernier panneau' );

  await browser.close();

  t.end();
});
