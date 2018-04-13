/**
 * accedeweb-tablist - WAI-ARIA tablist plugin based on AcceDe Web accessibility guidelines
 * @version v1.0.2
 * @link http://a11y.switch.paris/
 * @license ISC
 **/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.tablist = factory());
}(this, (function () { 'use strict';

  /*eslint no-fallthrough: "off"*/

  /**
   * Tablist constructor
   * @constructor
   * @param {Node} el - DOM node
   */
  class Tablist {

    constructor(el, options) {
      if (!el || !el.nodeName) {
        throw new Error('No DOM node provided. Abort.');
      }

      this.el = el;

      this.tablist = {};

      this.options = {
        closeTab: options && options.closeTab || this._noop,
        openTab: options && options.openTab || this._noop
      };

      this._handleDisplay = this._handleDisplay.bind(this);
      this._handleFocus = this._handleFocus.bind(this);
      this._handleTab = this._handleTab.bind(this);
      this._handlePanelFocus = this._handlePanelFocus.bind(this);
      this._handlePanel = this._handlePanel.bind(this);

      this.mount();
    }

    /**
     * Retrieve first activable tab (that does not have `disabled` attribute)
     */
    _firstActiveTab() {
      let activeTab;

      for (let i = 0; i < this.tablist.tabs.length; i++) {
        if (!this.tablist.tabs[i].disabled) {
          activeTab = i;
          break;
        }
      }

      return activeTab;
    }

    /**
     * Toggle display of the tabPanel (show/hide)
     * @param {DOMEvent} e - Can be a `MouseEvent` or a `KeyboardEvent` object
     */
    _handleDisplay(e) {
      e.preventDefault();

      const tab = e.currentTarget;

      if (tab.disabled) {
        return;
      }

      // ensure the tab has the focus when a click occurs
      if (tab !== document.activeElement) {
        tab.focus();
      }

      this._toggleDisplay(this.tablist.tabs.indexOf(tab));
    }

    /**
     * Update the current tab index before selecting the current tab
     * @param {DOMEvent} e - A `FocusEvent` object
     */
    _handleFocus(e) {
      const tab = e.currentTarget;

      if (tab.disabled) {
        return;
      }

      this.tablist.currentTabIndex = this.tablist.tabs.indexOf(tab);

      this._select(this.tablist.tabs[this.tablist.currentTabIndex]);
    }

    /**
     * Handle keystroke on [role=tabpanel]
     * @param {DOMEvent} e - A `KeyboardEvent` object
     */
    _handlePanel(e) {

      if (this.tablist.currentTabIndex === undefined) {
        this._handlePanelFocus(e);
      }

      switch (e.keyCode) {
        // ctrl + page up
        case 33:
          if (e.ctrlKey) {
            e.preventDefault();
            // focus the previous tab
            this._switchTab(this.tablist.currentTabIndex - 1);
          }
          break;
        // ctrl + page down
        case 34:
          if (e.ctrlKey) {
            e.preventDefault();
            // focus the next tab
            this._switchTab(this.tablist.currentTabIndex + 1);
          }
          break;

        // focus back to tab
        // ctrl + up
        case 38:
          if (e.ctrlKey) {
            e.preventDefault();
            // focus linked tab
            this._switchTab(this.tablist.currentTabIndex);
          }
          break;
      }
    }

    /**
     * Ensure that the current tab index is the one matching the tabPanel
     * @param {DOMEvent} e - A `FocusEvent` or `KeyboardEvent` object
     */
    _handlePanelFocus(e) {

      if (e.target.doubleFocus) {
        e.preventDefault();
        delete e.target.doubleFocus;

        return;
      }

      const tabPanel = e.currentTarget;

      this.tablist.currentTabIndex = this.tablist.tabPanels.indexOf(tabPanel);

      // prevent double focus event when the inputs are focused
      if (['radio', 'checkbox'].indexOf(e.target.type) >= 0) {
        e.target.doubleFocus = true;
      }
    }

    /**
     * Handle keystroke on [role=tab]
     * @param {DOMEvent} e - A `KeyboardEvent` object
     */
    _handleTab(e) {

      if (this.tablist.currentTabIndex === undefined) {
        this._handleFocus(e);
      }

      switch (e.keyCode) {
        // space
        case 32:
        // return
        case 13:
          // toggle the display of the linked tabpanel
          this._handleDisplay(e);
          break;

        // end
        case 35:
          e.preventDefault();
          // focus the last tab
          this._switchTab(this.tablist.tabs.length - 1);
          break;

        // home
        case 36:
          e.preventDefault();
          // focus the first active tab
          this._switchTab(this._firstActiveTab());
          break;

        // left
        case 37:
        // up
        case 38:
          e.preventDefault();
          // focus the previous tab
          this._switchTab(this.tablist.currentTabIndex - 1);
          break;

        // right
        case 39:
        // down
        case 40:
          e.preventDefault();
          // focus the next tab
          this._switchTab(this.tablist.currentTabIndex + 1);
          break;
      }
    }

    /**
     * Dummy function
     */
    _noop() {}

    /**
     * Update tab selected attributes (`aria-selected`, `tabindex`)
     * based on the `tabToSelect` attribute
     * @param {DOMElement} tabToSelect - Tab element to select
     */
    _select(tabToSelect) {
      // loop on each tab
      this.tablist.tabs.forEach((tab, index) => {
        const shouldSelect = tabToSelect === tab;

        tab.setAttribute('aria-selected', shouldSelect);
        tab.setAttribute('tabindex', shouldSelect ? 0 : -1);

        // only for tab to be selected
        if (shouldSelect) {
          this._toggleDisplay(index);
        }
      });
    }

    /**
     * Move the focus to the tab based on the index
     * @param {number} index - Index of the element to focus
     */
    _switchTab(index) {

      // handle disabled tab
      if (this.tablist.tabs[index] && this.tablist.tabs[index].disabled) {

        // cycling forward? Then go one item farther
        const newIndex = index > this.tablist.currentTabIndex ? index + 1 : index - 1;

        this._switchTab(newIndex);

        return;
      }

      this.tablist.currentTabIndex = index;

      if (this.tablist.currentTabIndex < this._firstActiveTab()) {
        this.tablist.currentTabIndex = this.tablist.tabsLength - 1;
      } else if (this.tablist.currentTabIndex >= this.tablist.tabsLength) {
        this.tablist.currentTabIndex = this._firstActiveTab();
      }

      this.tablist.tabs[this.tablist.currentTabIndex].focus();
    }

    /**
     * Toggle the `aria-expanded` attribute on the tabpanel based on the passed tab
     * @param {DOMElement} tab - Tab element
     */
    _toggleDisplay(index, show = true) {
      if (show && index === this.tablist.openedIndex) {
        return;
      }

      const tab = this.tablist.tabs[index];
      const tabPanel = this.tablist.tabPanels[index];

      // close the previous tab
      if (show && this.tablist.openedIndex !== undefined) {
        this._toggleDisplay(this.tablist.openedIndex, false);
      }

      tab.setAttribute('aria-expanded', show);
      tabPanel.setAttribute('aria-hidden', !show);

      if (show) {
        this.tablist.openedTab = tab;
        this.tablist.openedIndex = index;

        if (this.tablist.openedIndex !== undefined) {
          this.options.openTab(tab);
        }
      } else if (this.tablist.openedIndex !== undefined) {
        this.options.closeTab(tab);
      }
    }

    /**
     * Parse tablist element to setup the tab and tabpanel elements
     */
    mount() {
      let firstTabIndex;
      let openedTab = false;

      // create reference arrays
      this.tablist.tabs = [];
      this.tablist.tabPanels = [];

      // loop on each tab elements to find tabpanel elements and update their attributes
      Array.from(this.el.querySelectorAll('[role=tab]')).forEach((tab, index) => {
        const controls = tab.getAttribute('aria-controls');
        let tabPanel;

        // get the tabpanel linked to the tab element
        if (controls) {
          tabPanel = document.getElementById(controls);
        } else if (tab.nextElementSibling && tab.nextElementSibling.getAttribute('aria-labelledby') === tab.id) {
          tabPanel = tab.nextElementSibling;
        }

        if (!tabPanel) {
          throw new Error(`Could not find associated tabpanel for tab ${tab.id}. Use [aria-controls="tabpanelId"] on the [role="tab"] element to link them together`);
        }

        // link the tab to the tabpanel element
        // tabPanel.tab = tab;

        // tab.tabList = tablist;

        tab.disabled = tab.hasAttribute('disabled') || tab.getAttribute('aria-disabled') === 'true';

        // if there's no opened tab yet
        if (tab.hasAttribute('data-tab-open') && !tab.disabled) {
          if (!this.tablist.openedTab) {
            // store the tab in the openedTab array
            // this.tablist.openedTab = tab;
            // this.tablist.openedIndex = index;

            this._toggleDisplay(index, true);

            openedTab = true;
          }
        }

        // remove setup data attributes
        tab.removeAttribute('data-tab-open');

        // get first non-disabled tab
        if (firstTabIndex === undefined && !tab.disabled) {
          firstTabIndex = index;
        }

        // set the attributes according the the openedTab status
        tab.setAttribute('tabindex', -1);
        tab.setAttribute('aria-expanded', openedTab);
        tabPanel.setAttribute('aria-hidden', !openedTab);

        // store the tab and the tabpanel on their respective arrays on the tablist
        this.tablist.tabs.push(tab);
        this.tablist.tabPanels.push(tabPanel);

        // subscribe internal events for tab and tap panel
        tab.addEventListener('click', this._handleDisplay);
        tab.addEventListener('focus', this._handleFocus);
        tab.addEventListener('keydown', this._handleTab);
        tabPanel.addEventListener('focus', this._handlePanelFocus);
        tabPanel.addEventListener('keydown', this._handlePanel);
      });

      // store constants
      this.tablist.tabsLength = this.tablist.tabs.length;
      this.tablist.tabPanelsLength = this.tablist.tabPanels.length;

      // set the tabindex so the first opened tab or the first non-disabled tab can be focused on tab navigation
      if (this.tablist.openedTab) {
        this.tablist.openedTab.setAttribute('tabindex', 0);
      }
      // if there's no opened tab and it's not an accordion open the first tab
      else if (!this.tablist.openedTab) {
          this._toggleDisplay(firstTabIndex, true);
          this.tablist.tabs[firstTabIndex].setAttribute('tabindex', 0);
          // this.tablist.tabs[ firstTabIndex ].setAttribute( 'aria-expanded', true );
          // this.tablist.tabPanels[ firstTabIndex ].setAttribute( 'aria-hidden', false );

          // this.tablist.openedTab = this.tablist.tabs[ firstTabIndex ];
        } else {
          this.tablist.tabs[firstTabIndex].setAttribute('tabindex', 0);
        }
    }

    /**
     * Returns the opened tab or array of opened tabs
     */
    get openedTab() {
      return this.tablist.openedTab;
    }

    /**
     * unbind tablist
     */
    unmount(clean) {

      this.tablist.tabs.forEach((tab, index) => {
        const tabPanel = this.tablist.tabPanels[index];

        // unsubscribe internal events for tab and tap panel
        tab.removeEventListener('click', this._handleDisplay);
        tab.removeEventListener('focus', this._handleFocus);
        tab.removeEventListener('keydown', this._handleTab);

        tab.removeAttribute('tabindex');
        tab.removeAttribute('aria-selected');
        tab.removeAttribute('aria-expanded');

        tabPanel.removeEventListener('focus', this._handlePanelFocus);
        tabPanel.removeEventListener('keydown', this._handlePanel);
        tabPanel.setAttribute('aria-hidden', 'false');
      });

      this.tablist = {};
    }
  }

  return Tablist;

})));
