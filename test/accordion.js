/* globals describe: true, afterEach: true, expect: true, it: true */
describe( 'Comportements d\'Accordéon', function(){

  var tablist = document.querySelector( '[role=tablist]' ),
      //multiselectable = tablist.getAttribute( 'aria-multiselectable' ) === 'true',
      tabs = document.querySelectorAll( '[role=tab]' ),
      tabpanels = document.querySelectorAll( '[role=tabpanel]' ),
      noop = function(){};

  afterEach(function() {
    window.tablist.closeAll( tablist, true );
  } );

  function fakeEvent( el, evtName, keyCode, ctrlKey ){
    var fake = {
      preventDefault: noop,
      stopPropagation: noop,
      type: evtName,
      currentTarget: el
    },
    isTab = 'tab' === el.getAttribute( 'role' ),
    action;

    if( keyCode ){
      fake.keyCode = keyCode;
    }

    if( ctrlKey ){
      fake.ctrlKey = true;
    }

    if( 'click' === evtName ){
      action = 'tabAction';
    }
    else if( 'focus' === evtName ){
      if( isTab ){
        action = 'tabFocus';
      }
      else{
        action = 'panelFocus';
      }
    }
    else{
      if( isTab ){
        action = 'tabKey';
      }
      else{
        action = 'panelKey';
      }
    }

    window.tablist[ action ]( fake );
  }

  it( 'L’entête de panneau ayant le focus est le seul à avoir la valeur « true » pour l’attribut « aria-selected ».', function(){
    tabs[ 0 ].focus();

    expect( tabs[ 0 ].getAttribute( 'aria-selected' ) ).to.be.equal( 'true' );
    expect( document.querySelectorAll( '[aria-selected=true]' ).length ).to.be.equal( 1 );
  } );

  it( 'L’entête de panneau ayant le focus est le seul à avoir la valeur « 0 » pour l’attribut « tabindex ».', function(){
    tabs[ 0 ].focus();

    expect( tabs[ 0 ].getAttribute( 'tabindex' ) ).to.be.equal( '0' );
    expect( document.querySelectorAll( '[role=tab][tabindex="0"]' ).length ).to.be.equal( 1 );
  } );

  it( 'Les entêtes de panneau n’ayant pas le focus ont la valeur « false » pour l’attribut « aria-selected ».', function(){
    expect( document.querySelectorAll( '[aria-selected=false]' ).length ).to.be.equal( tabs.length - 1 );
  } );

  it( 'Les entêtes de panneau n’ayant pas le focus ont la valeur « -1 » pour l’attribut « tabindex ».', function(){
    expect( document.querySelectorAll( '[role=tab][tabindex="-1"]' ).length ).to.be.equal( tabs.length - 1 );
  } );

  it( 'Un « Click », une pression sur la touche « Entrée » ou sur la touche « Espace » sur un entête de panneau dont la valeur l’attribut « aria-expanded » est à « false » modifie la valeur de cet attribut en la passant à « true ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « true » à « false ».', function(){
    fakeEvent( tabs[ 0 ], 'click' );

    expect( tabs[ 0 ].getAttribute( 'aria-expanded' ) ).to.be.equal( 'true' );
    expect( tabpanels[ 0 ].getAttribute( 'aria-hidden' ) ).to.be.equal( 'false' );
  } );

  it( 'Un « Click », une pression sur la touche « Entrée » ou sur la touche « Espace » sur un entête de panneau dont la valeur l’attribut « aria-expanded » est à « true » modifie la valeur de cet attribut en la passant à « false ». La valeur de l’attribut « aria-hidden » du panneau associé à l’entête passe de la valeur « false » à « true ».', function(){
    fakeEvent( tabs[ 0 ], 'click' );

    fakeEvent( tabs[ 0 ], 'click' );

    expect( tabs[ 0 ].getAttribute( 'aria-expanded' ) ).to.be.equal( 'false' );
    expect( tabpanels[ 0 ].getAttribute( 'aria-hidden' ) ).to.be.equal( 'true' );

  } );

  it( 'Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur le premier entête de panneau déplace le focus sur le dernier entête de panneau.', function(){
    tabs[ 0 ].focus();

    fakeEvent( tabs[ 0 ], 'keydown', 38 );

    expect( tabs[ tabs.length-1 ] ).to.be.equal( document.activeElement );

  } );

  it( 'Une pression sur la touche « Flèche haut » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau précédent.', function(){
    tabs[ 1 ].focus();

    fakeEvent( tabs[ 0 ], 'keydown', 38 );

    expect( tabs[ 0 ] ).to.be.equal( document.activeElement );

  } );

  it( 'Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur le premier entête de panneau déplace le focus sur le dernier entête de panneau.', function(){
    tabs[ 0 ].focus();

    fakeEvent( tabs[ 0 ], 'keydown', 37 );

    expect( tabs[ tabs.length-1 ] ).to.be.equal( document.activeElement );

  } );

  it( 'Une pression sur la touche « Flèche gauche » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau précédent.', function(){
    tabs[ 1 ].focus();

    fakeEvent( tabs[ 0 ], 'keydown', 37 );

    expect( tabs[ 0 ] ).to.be.equal( document.activeElement );

  } );

  it( 'Une pression sur la touche « Flèche bas » lorsque le focus est positionné sur le premier entête de panneau déplace le focus sur le dernier entête de panneau.', function(){
    tabs[ tabs.length-1 ].focus();

    fakeEvent( tabs[ tabs.length-1 ], 'keydown', 40 );

    expect( tabs[ 0 ] ).to.be.equal( document.activeElement );

  } );

  it( 'Une pression sur la touche « Flèche bas » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau précédent.', function(){
    tabs[ 1 ].focus();

    fakeEvent( tabs[ 2 ], 'keydown', 40 );

    expect( tabs[ 2 ] ).to.be.equal( document.activeElement );

  } );

  it( 'Une pression sur la touche « Flèche droite » lorsque le focus est positionné sur le premier entête de panneau déplace le focus sur le dernier entête de panneau.', function(){
    tabs[ tabs.length-1 ].focus();

    fakeEvent( tabs[ tabs.length-1 ], 'keydown', 39 );

    expect( tabs[ 0 ] ).to.be.equal( document.activeElement );

  } );

  it( 'Une pression sur la touche « Flèche droite » lorsque le focus est positionné sur un entête de panneau déplace le focus sur l’entête de panneau précédent.', function(){
    tabs[ 1 ].focus();

    fakeEvent( tabs[ 2 ], 'keydown', 39 );

    expect( tabs[ 2 ] ).to.be.equal( document.activeElement );

  } );

  it( 'Une pression sur la combinaison de touches « Ctrl+Flèche haut » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de ce panneau.', function(){
    // open panek first
    fakeEvent( tabs[ 0 ], 'click' );

    var linkInPanel = tabpanels[ 0 ].querySelector( 'a' );
    linkInPanel.focus();

    fakeEvent( tabpanels[ 0 ], 'keydown' , 38, true );

    expect( tabs[ 0 ] ).to.be.equal( document.activeElement );
  } );

  it( 'Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément du premier panneau déplace le focus sur le dernier entête de panneau.', function(){

    var linkInPanel = tabpanels[ 0 ].querySelector( 'a' );
    linkInPanel.focus();

    fakeEvent( tabpanels[ 0 ], 'keydown' , 33, true );

    expect( tabs[ tabs.length-1 ] ).to.be.equal( document.activeElement );
  } );

  it( 'Une pression sur la combinaison de touches « Ctrl+Page précédente » lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de panneau précédent.', function(){
    // open panek first
    fakeEvent( tabs[ 1 ], 'click' );

    var linkInPanel = tabpanels[ 1 ].querySelector( 'a' );
    linkInPanel.focus();

    fakeEvent( tabpanels[ 1 ], 'keydown' , 33, true );

    expect( tabs[ 0 ] ).to.be.equal( document.activeElement );
  } );

  it( 'Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément du dernier panneau déplace le focus sur le premier entête de panneau.', function(){
    // open panek first
    fakeEvent( tabs[ tabs.length-1 ], 'click' );

    var linkInPanel = tabpanels[ tabpanels.length-1 ].querySelector( 'a' );
    linkInPanel.focus();

    fakeEvent( tabpanels[ tabpanels.length-1 ], 'keydown' , 34, true );

    expect( tabs[ 0 ] ).to.be.equal( document.activeElement );
  } );

  it( 'Une pression sur la combinaison de touches « Ctrl+Page suivante» lorsque le focus est positionné sur un élément d’un panneau déplace le focus sur l’entête de panneau suivant.', function(){
    // open panek first
    fakeEvent( tabs[ 1 ], 'click' );

    var linkInPanel = tabpanels[ 1 ].querySelector( 'a' );
    linkInPanel.focus();

    fakeEvent( tabpanels[ 1 ], 'keydown' , 34, true );

    expect( tabs[ 2 ] ).to.be.equal( document.activeElement );
  } );

  it( 'Une pression sur la touche « Origine », lorsque le focus est positionné sur un entête de panneau, déplace le focus sur le premier entête de panneau.', function(){

    tabs[ 2 ].focus();

    fakeEvent( tabs[ 2 ], 'keydown' , 36 );

    expect( tabs[ 0 ] ).to.be.equal( document.activeElement );
  } );

  it( 'Une pression sur la touche « Fin », lorsque le focus est positionné sur un entête de panneau, déplace le focus sur le dernier entête de panneau.', function(){

    tabs[ 2 ].focus();

    fakeEvent( tabs[ 2 ], 'keydown' , 35 );

    expect( tabs[ tabs.length-1  ] ).to.be.equal( document.activeElement );
  } );

} );
