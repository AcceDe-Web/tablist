(function(window, document, exportName, undefined) {
  'use strict';

  var Tablist = function( selector ){

    // close all tabs
    function closeTabs( tablist, silent ){
      var openedTabs;

      // kill switch if there's no opened tab or if it's not an accoridion
      if( !tablist.openedTab.length || null === tablist.multiselectable ){
        return;
      }

      // copy the opened tabs array to close them all
      openedTabs = Array.prototype.slice.call( tablist.openedTab );

      // loop on each opened tabs
      openedTabs.forEach( function( tab ){
        // close the tab without triggering any event
        if( silent ){
          toggleDisplay( tab );
        }
        // close with triggering events
        else{
          tab.click();
        }
      } );
    }

    // toggle display of the tabPanel (show/hide)
    function handleDisplay( e ){
      e.preventDefault();

      var tab = e.currentTarget;

      toggleDisplay( tab );

    }

    // ensure that the current tab index is the one matching the tabPanel
    function handlePanelFocus( e ){
      e.preventDefault();

      if( e.target.doubleFocus ){
        delete e.target.doubleFocus;
        return;
      }

      var tabPanel = e.currentTarget,
          tab;

      tab = tabPanel.tab;

      tabPanel.tablist.currentTabIndex = tabPanel.tablist.tabs.indexOf( tab );

      // prevent double focus event when the inputs are focused
      if( [ 'radio', 'checkbox' ].indexOf( e.target.type ) >= 0 ){
        e.target.doubleFocus = true;
      }
    }

    // update the current tab index before selecting the current tab
    function handleFocus( e ){
      var tab = e.currentTarget,
          tablist = tab.tablist;

      tablist.currentTabIndex = tablist.tabs.indexOf( tab );

      select( tablist.tabs[ tablist.currentTabIndex ] );

    }

    // handle keystroke on [role=tabpanel]
    function handlePanel( e ){
      var tabPanel = e.currentTarget;

      switch( e.keyCode ){
        case 33: // ctrl + page up
          if( e.ctrlKey ){
            e.preventDefault();
            // focus the previous tab
            switchTab( tabPanel.tablist, tabPanel.tablist.currentTabIndex - 1 );
          }
          break;
        case 34: // ctrl + page down
          if( e.ctrlKey ){
            e.preventDefault();
            // focus the next tab
            switchTab( tabPanel.tablist, tabPanel.tablist.currentTabIndex + 1 );
          }
          break;
        // focus back to tab
        case 38: // ctrl + up
          if( e.ctrlKey ){
            e.preventDefault();
            // focus linked tab
            switchTab( tabPanel.tablist, tabPanel.tablist.currentTabIndex );
          }
          break;
      }
    }

    // handle keystroke on [role=tab]
    function handleTab( e ){
      var tab = e.currentTarget;

      switch( e.keyCode ){
        case 32: // space
        case 13: // return
          // toggle the display of the linked tabpanel
          handleDisplay( e );
          break;
        case 35: // end
          e.preventDefault();
          // focus the last tab
          switchTab( tab.tablist, tab.tablist.tabs.length - 1 );
          break;
        case 36: // home
          e.preventDefault();
          // focus the first tab
          switchTab( tab.tablist, 0 );
          break;
        case 37: // left
        case 38: // up
          e.preventDefault();
          // focus the previous tab
          switchTab( tab.tablist, tab.tablist.currentTabIndex - 1 );
          break;
        case 39: // right
        case 40: // down
          e.preventDefault();
          // focus the next tab
          switchTab( tab.tablist, tab.tablist.currentTabIndex + 1 );
          break;
      }
    }

    function init(){
      var tablists;

      // if there's no selector provided parse the whole document
      if( !selector ){
        tablists = document.querySelectorAll( '[role=tablist]' );
      }
      // if it's a string query it
      else if( 'string' === typeof selector ){
        tablists = document.querySelectorAll( selector );
      }
      // otherwise assume it's an element (risky)
      else{
        tablists = selector;
      }

      // ensure tablists is an array
      if( tablists && !tablists.length ){
        tablists = [ tablists ];
      }
      else{
        tablists = Array.prototype.slice.call( tablists );
      }

      tablists.forEach( function( tablist ){
        // build tablists references
        setTablist( tablist );
      } );
    }

    // update tab "selected" attributes (aria-selected, tabindex)
    // based on the tabToSelect attribute
    function select( tabToSelect ){
      var shoudlSelect;
      // loop on each tabs
      tabToSelect.tablist.tabs.forEach( function( tab ){

        shoudlSelect = tabToSelect === tab;

        tab.setAttribute( 'aria-selected', shoudlSelect );
        tab.setAttribute( 'tabindex', shoudlSelect ? 0 : -1 );

        // only for tab to be selected
        if( shoudlSelect ){
          tab.focus();

          // if it's not an accordion also open the linked tabpanel
          if( null === tabToSelect.tablist.multiselectable ){
            toggleDisplay( tab );
          }
        }
      } );
    }

    // parse tablist elements to setup the tab and tabpanel elements
    function setTablist( tablist ){
      var controls,
          openedTab,
          firstOpenedTab;
      // create reference arrays
      tablist.tabs = [];
      tablist.tabPanels = [];
      tablist.openedTab = [];

      // set multiselectable to `true`, `false` or `null`
      // a `null` value will define a tab setup instead of an accordion
      tablist.multiselectable = tablist.attributes[ 'aria-multiselectable' ] ? tablist.attributes[ 'aria-multiselectable' ].value === 'true' : null;

      // loop on each tab elements to find tabpanel elements and update their attributes
      Array.prototype.forEach.call( tablist.querySelectorAll( '[role=tab]' ), function( tab ){
        openedTab = false;
        controls = tab.getAttribute( 'aria-controls' )
        // link the tablist to the tab element
        tab.tablist = tablist;
        // link the tabpanel to the tab element
        if( controls ){
          tab.tabPanel = document.getElementById( controls );
        }
        else if( tab.nextElementSibling && tab.nextElementSibling.attributes[ 'aria-labelledby' ] ){
          tab.tabPanel = tab.nextElementSibling.attributes[ 'aria-labelledby' ].value === tab.id ? tab.nextElementSibling : null;
          if( !tab.tabPanel ){
            throw new Error( 'Could not find associated tabpanel for tab '+tab.id )
          }
        }
        // link the tablist to the tabpanel element
        tab.tabPanel.tablist = tablist;
        // link the tab to the tabpanel element
        tab.tabPanel.tab = tab;

        // set the tab as opened if aria-expanded = true and theres no other tab open (when aria-multiselectable is not true)
        if( tab.getAttribute( 'aria-expanded' ) === 'true' ){
          // if tablist is multiselectable or when the tablist is not multiselectable and theres no opened tab yet
          if( tablist.multiselectable || (!tablist.multiselectable && !tablist.openedTab.length ) ){
            // store the tab in the openedTab array
            tablist.openedTab.push( tab );
            openedTab = true;
          }
        }

        // check if the current tab is the first opened (opened tab array's length should be 1)
        firstOpenedTab = openedTab && 2 > tablist.openedTab.length;

        // set the attributes according the the openedTab status
        tab.setAttribute( 'tabindex', firstOpenedTab ? 0 : -1 );
        tab.setAttribute( 'aria-selected', firstOpenedTab ? true : false );
        tab.setAttribute( 'aria-expanded', openedTab );
        tab.tabPanel.setAttribute( 'aria-hidden', !openedTab );

        // store the tab and the tabpanel on their respective arrays on the tablist
        tablist.tabs.push( tab );
        tablist.tabPanels.push( tab.tabPanel );
      } );

      // store constants
      tablist.tabsLength = tablist.tabs.length;
      tablist.tabPanelsLength = tablist.tabPanels.length;

      // if there's no opened tab and it's not an accordion open the first tab
      if( !tablist.openedTab.length && null === tablist.multiselectable ){
        select( tablist.tabs[ 0 ] );
      }
    }

    // move the focus to the tab based on the index
    function switchTab( tablist, index ){

      tablist.currentTabIndex = index;

      if( tablist.currentTabIndex < 0 ){
        tablist.currentTabIndex = tablist.tabsLength - 1;
      }
      else if( tablist.currentTabIndex >= tablist.tabsLength ){
        tablist.currentTabIndex = 0;
      }

      tablist.tabs[ tablist.currentTabIndex ].focus();

    }

    // toggle the aria-expanded attribute on the tabpanel based on the passed tab
    function toggleDisplay( tab ){
      var tablist = tab.tablist,
          tabPanel,
          expanded,
          openedIndex;

      tabPanel = tab.tabPanel;
      // get the current expanded status
      expanded = tab.getAttribute( 'aria-expanded' ) === "true";

      // don't set aria-expanded to false when it's not an accordion
      if( null === tablist.multiselectable && expanded ){
        return;
      }
      // if the tab is currently expanded it has to be closed
      if( expanded ){
        // find the tab index in the openedTab array
        openedIndex = tablist.openedTab.indexOf( tab );
        // remove it form the array of opened tabs
        tablist.openedTab.splice( openedIndex, 1 );
      }
      else{
        // if the tablist is not multiselectable
        // loop on each openedTab to close it
        if( !tablist.multiselectable ){
          tablist.openedTab.forEach( function( openedTab ){
            openedTab.setAttribute( 'aria-expanded', false );
            openedTab.tabPanel.setAttribute( 'aria-hidden', true );
          } );
          // empty the array of opened tab because we closed them all
          tablist.openedTab.length = 0;
        }
        // add the current tab to the array of opened tabs
        tablist.openedTab.push( tab );
      }

      // reverse the value of the aria-expanded attribute
      tab.setAttribute( 'aria-expanded', !expanded );
      // update the aria-hidden attribute on the tabpanel
      tabPanel.setAttribute( 'aria-hidden', expanded );

    }

    init();

    return {
      init: init,
      tabKey: handleTab,
      tabFocus: handleFocus,
      tabAction: handleDisplay,
      panelKey: handlePanel,
      panelFocus: handlePanelFocus,
      closeAll: closeTabs
    };
  };


  if (typeof define == 'function' && define.amd) {
    define(function() {
      return Tablist;
    });
  } else if (typeof module != 'undefined' && module.exports) {
    module.exports = Tablist;
  } else {
    window[exportName] = Tablist;
  }

})(window, document, 'Tablist');
