/* global define, module */

/**
 * Tablist module
 * @module Tablist
 * @param {Object} window - Browser window object
 * @param {Object} document - Browser document object
 * @param {string} exportName - Module export name. Constructor reference will be accessible on window[exportName].
 */
(function(window, document, exportName) {
  'use strict';

  /**
   * Tablist constructor
   * @constructor
   * @param {Node} elm - DOM node
   */
  var Tablist = function( elm, options ){

    var tablist = elm;

    /**
     * Close all tabs
     * @param {boolean} [silent] - If closing tabs should dispatch events
     */
    this.closeTabs = function closeTabs( silent ){
      var openedTabs;

      // kill switch if there's no opened tab or if it's not an accordion
      if( !tablist.openedTab.length || null === tablist.multiselectable ){
        return;
      }

      // copy the opened tabs array to close them all
      openedTabs = Array.prototype.slice.call( tablist.openedTab );

      // loop on each opened tab
      openedTabs.forEach(( function( tab ){
        // close the tab without triggering any event
        if( silent ){
          this.toggleDisplay( tab );
        }
        // close with triggering events
        else{
          tab.click();
        }
      }).bind( this ));

      if ( !silent && null !== tablist.multiselectable ) {
        options.closeAll( openedTabs );
      }
    };


    /**
     * Retrieve first activable tab (that does not have `disabled` attribute)
     */
    this.firstActiveTab = function firstActiveTab() {
      var i = 0,
          activeTab;

      for(; i < tablist.tabs.length; i++ ) {
        if ( !tablist.tabs[ i ].hasAttribute( 'disabled' )) {
          activeTab = i;
          break;
        }
      }

      return activeTab;
    };


    /**
     * Toggle display of the tabPanel (show/hide)
     * @param {DOMEvent} e - Can be a `MouseEvent` or a `KeyboardEvent` object
     */
    this.handleDisplay = function handleDisplay( e ){
      e.preventDefault();

      var tab = e.currentTarget;

      // ensure the tab has the focus when a click occurs
      if( tab !== document.activeElement ){
        tab.focus();
      }

      this.toggleDisplay( tab );
    };


    /**
     * Update the current tab index before selecting the current tab
     * @param {DOMEvent} e - A `FocusEvent` object
     */
    this.handleFocus = function handleFocus( e ){
      var tab = e.currentTarget;

      tablist.currentTabIndex = tablist.tabs.indexOf( tab );

      this.select( tablist.tabs[ tablist.currentTabIndex ] );
    };


    /**
     * Handle keystroke on [role=tabpanel]
     * @param {DOMEvent} e - A `KeyboardEvent` object
     */
    this.handlePanel = function handlePanel( e ){

      if ( tablist.currentTabIndex === undefined ) {
        this.handlePanelFocus( e );
      }

      switch( e.keyCode ){
        case 33: // ctrl + page up
          if( e.ctrlKey ){
            e.preventDefault();
            // focus the previous tab
            this.switchTab( tablist.currentTabIndex - 1 );
          }
          break;

        case 34: // ctrl + page down
          if( e.ctrlKey ){
            e.preventDefault();
            // focus the next tab
            this.switchTab( tablist.currentTabIndex + 1 );
          }
          break;

        // focus back to tab
        case 38: // ctrl + up
          if( e.ctrlKey ){
            e.preventDefault();
            // focus linked tab
            this.switchTab( tablist.currentTabIndex );
          }
          break;
      }
    };


    /**
     * Ensure that the current tab index is the one matching the tabPanel
     * @param {DOMEvent} e - A `FocusEvent` or `KeyboardEvent` object
     */
    this.handlePanelFocus = function handlePanelFocus( e ){
      e.preventDefault();

      if( e.target.doubleFocus ){
        delete e.target.doubleFocus;
        return;
      }

      var tabPanel = e.currentTarget,
          tab;

      tab = tabPanel.tab;

      tablist.currentTabIndex = tablist.tabs.indexOf( tab );

      // prevent double focus event when the inputs are focused
      if( [ 'radio', 'checkbox' ].indexOf( e.target.type ) >= 0 ){
        e.target.doubleFocus = true;
      }
    };


    /**
     * Handle keystroke on [role=tab]
     * @param {DOMEvent} e - A `KeyboardEvent` object
     */
    this.handleTab = function handleTab( e ){

      if ( tablist.currentTabIndex === undefined ) {
        this.handleFocus( e );
      }

      switch( e.keyCode ){
        case 32: // space
        case 13: // return
          // toggle the display of the linked tabpanel
          this.handleDisplay( e );
          break;

        case 35: // end
          e.preventDefault();
          // focus the last tab
          this.switchTab( tablist.tabs.length - 1 );
          break;

        case 36: // home
          e.preventDefault();
          // focus the first active tab
          this.switchTab( this.firstActiveTab() );
          break;

        case 37: // left
        case 38: // up
          e.preventDefault();
          // focus the previous tab
          this.switchTab( tablist.currentTabIndex - 1 );
          break;

        case 39: // right
        case 40: // down
          e.preventDefault();
          // focus the next tab
          this.switchTab( tablist.currentTabIndex + 1 );
          break;
      }
    };


    /**
     * Kickstart Tablist instance
     */
    this.init = function init(){

      if ( !elm || !elm.nodeName ) {
        throw new Error( 'No DOM node provided. Abort.' );
      }

      options = {
        closeAll: options && options.closeAll || this.noop,
        closeTab: options && options.closeTab || this.noop,
        openTab: options && options.openTab || this.noop
      };

      this.setTablist();
    };


    /**
     * Dummy function
     */
    this.noop = function(){};


    /**
     * Update tab selected attributes (`aria-selected`, `tabindex`)
     * based on the `tabToSelect` attribute
     * @param {DOMElement} tabToSelect - Tab element to select
     */
    this.select = function select( tabToSelect ){
      var shouldSelect;

      // loop on each tab
      tablist.tabs.forEach(( function( tab ){
        shouldSelect = tabToSelect === tab;

        tab.setAttribute( 'aria-selected', shouldSelect );
        tab.setAttribute( 'tabindex', shouldSelect ? 0 : -1 );

        // only for tab to be selected
        if ( shouldSelect ) {
          // if it's not an accordion also open the linked tabpanel
          if( null === tablist.multiselectable ){
            this.toggleDisplay( tab );
          }
        }
      }).bind( this ));
    };


    /**
     * Parse tablist element to setup the tab and tabpanel elements
     */
    this.setTablist = function setTablist(){
      var controls,
          openedTab,
          firstTab;

      // create reference arrays
      tablist.tabs = [];
      tablist.tabPanels = [];
      tablist.openedTab = [];

      // set multiselectable to `true`, `false` or `null`
      // a `null` value will define a tab setup instead of an accordion
      tablist.multiselectable = tablist.attributes[ 'aria-multiselectable' ] ? tablist.attributes[ 'aria-multiselectable' ].value === 'true' : null;


      // loop on each tab elements to find tabpanel elements and update their attributes
      Array.prototype.forEach.call( tablist.querySelectorAll( '[role=tab]' ), ( function( tab ){
        openedTab = false;
        controls = tab.getAttribute( 'aria-controls' );
        // link the tabpanel to the tab element
        if( controls ){
          tab.tabPanel = document.getElementById( controls );
        }
        else if( tab.nextElementSibling && tab.nextElementSibling.hasAttribute( 'aria-labelledby' ) ){
          tab.tabPanel = tab.nextElementSibling.getAttribute( 'aria-labelledby' ) === tab.id ? tab.nextElementSibling : null;
          if( !tab.tabPanel ){
            throw new Error( 'Could not find associated tabpanel for tab '+tab.id );
          }
        }
        // link the tab to the tabpanel element
        tab.tabPanel.tab = tab;

        // if tablist is not multiselectable and there's no opened tab yet
        if( !tablist.multiselectable && !tablist.openedTab.length && !tab.hasAttribute( 'disabled' )){
          // store the tab in the openedTab array
          tablist.openedTab.push( tab );
          openedTab = true;
        }

        // get first tab
        firstTab = tab === tablist.querySelector( '[role="tab"]:not([disabled])' );

        // set the attributes according the the openedTab status
        tab.setAttribute( 'tabindex', firstTab ? 0 : -1 );
        tab.setAttribute( 'aria-expanded', openedTab );
        tab.tabPanel.setAttribute( 'aria-hidden', !openedTab );

        // store the tab and the tabpanel on their respective arrays on the tablist
        tablist.tabs.push( tab );
        tablist.tabPanels.push( tab.tabPanel );

        // subscribe internal events for tab and tap panel
        tab.addEventListener( 'click', this.handleDisplay.bind( this ));
        tab.addEventListener( 'focus', this.handleFocus.bind( this ));
        tab.addEventListener( 'keydown', this.handleTab.bind( this ));
        tab.tabPanel.addEventListener( 'focus', this.handlePanelFocus.bind( this ));
        tab.tabPanel.addEventListener( 'keydown', this.handlePanel.bind( this ));
      }).bind( this ));

      // store constants
      tablist.tabsLength = tablist.tabs.length;
      tablist.tabPanelsLength = tablist.tabPanels.length;

      // if there's no opened tab and it's not an accordion open the first tab
      if( !tablist.openedTab.length && null === tablist.multiselectable ){
        this.select( tablist.tabs[ 0 ] );
      }
    };


    /**
     * Move the focus to the tab based on the index
     * @param {number} index - Index of the element to focus
     */
    this.switchTab = function switchTab( index ){

      // handle disabled tab
      var newIndex;
      if ( tablist.tabs[ index ] && tablist.tabs[ index ].hasAttribute( 'disabled' )) {

        // cycling forward? Then go one item farther
        newIndex = index > tablist.currentTabIndex ? index + 1 : index - 1;

        this.switchTab( newIndex );
        return;
      }

      tablist.currentTabIndex = index;

      if( tablist.currentTabIndex < this.firstActiveTab() ){
        tablist.currentTabIndex = tablist.tabsLength - 1;
      }
      else if( tablist.currentTabIndex >= tablist.tabsLength ){
        tablist.currentTabIndex = this.firstActiveTab();
      }

      tablist.tabs[ tablist.currentTabIndex ].focus();
    };


    /**
     * Toggle the `aria-expanded` attribute on the tabpanel based on the passed tab
     * @param {DOMElement} tab - Tab element
     */
    this.toggleDisplay = function toggleDisplay( tab ){
      var tabPanel,
          expanded,
          openedIndex;

      tabPanel = tab.tabPanel;
      // get the current expanded status
      expanded = tab.getAttribute( 'aria-expanded' ) === "true";

      // don't set `aria-expanded` to `false` when it's not an accordion
      if( null === tablist.multiselectable ){
        if ( expanded ) {
          return;
        }

        // execute close tab callback
        // tab mode: so only 1 tab can be opened at once
        options.closeTab( tablist.openedTab[ 0 ]);
      }

      // if the tab is currently expanded it has to be closed
      if( expanded ){
        // find the tab index in the openedTab array
        openedIndex = tablist.openedTab.indexOf( tab );
        // remove it from the array of opened tabs
        tablist.openedTab.splice( openedIndex, 1 );

        // execute close tab callback
        options.closeTab( tab );
      }

      else {
        // if the tablist is not multiselectable
        // loop on each openedTab to close it
        if( !tablist.multiselectable ){
          tablist.openedTab.forEach( function( openedTab ){
            openedTab.setAttribute( 'aria-expanded', false );
            openedTab.tabPanel.setAttribute( 'aria-hidden', true );
          });
          // empty the array of opened tab because we closed them all
          tablist.openedTab.length = 0;
        }
        // add the current tab to the array of opened tabs
        tablist.openedTab.push( tab );

        // execute open tab callback
        options.openTab( tab );
      }

      // reverse the value of the `aria-expanded` attribute
      tab.setAttribute( 'aria-expanded', !expanded );
      // update the `aria-hidden` attribute on the tabpanel
      tabPanel.setAttribute( 'aria-hidden', expanded );
    };


    // init Tablist instance
    this.init();

    // expose what user might need
    return {
      closeAll: this.closeTabs,
      openedTab: tablist.openedTab
    };
  };


  // Export our constructor
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return Tablist;
    });
  }

  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tablist;
  }

  else {
    window[exportName] = Tablist;
  }

})(window, document, 'Tablist');
