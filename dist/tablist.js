/**
 * @accede-web/tablist - WAI-ARIA tablist plugin based on AcceDe Web accessibility guidelines
 * @version v2.0.1
 * @link http://a11y.switch.paris/
 * @license ISC
 **/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Tablist = factory());
}(this, (function () { 'use strict';

  /*eslint no-fallthrough: "off"*/
  const callbackEvents = ['hide', 'show'];

  /**
   * Tablist constructor
   * @constructor
   * @param {Node} el - DOM node
   */
  class Tablist {

    constructor(el) {
      if (!el || !el.nodeName) {
        throw new Error('No DOM node provided. Abort.');
      }

      this.el = el;

      this._tablist = {};

      this._callbacks = {};

      this._handleDisplay = this._handleDisplay.bind(this);
      this._handleFocus = this._handleFocus.bind(this);
      this._handleTab = this._handleTab.bind(this);
      this._handlePanelFocus = this._handlePanelFocus.bind(this);
      this._handlePanel = this._handlePanel.bind(this);
    }

    /**
     * Retrieve first activable tab (that does not have `disabled` attribute)
     */
    _firstActiveTab() {
      let activeTab;

      for (let i = 0; i < this._tablist.tabs.length; i++) {
        if (!this._tablist.tabs[i].disabled) {
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

      this._toggleDisplay(this._tablist.tabs.indexOf(tab));
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

      this._tablist.currentTabIndex = this._tablist.tabs.indexOf(tab);

      this._select(this._tablist.tabs[this._tablist.currentTabIndex]);
    }

    /**
     * Handle keystroke on [role=tabpanel]
     * @param {DOMEvent} e - A `KeyboardEvent` object
     */
    _handlePanel(e) {

      if (this._tablist.currentTabIndex === undefined) {
        this._handlePanelFocus(e);
      }

      switch (e.keyCode) {
        // ctrl + page up
        case 33:
          if (e.ctrlKey) {
            e.preventDefault();
            // focus the previous tab
            this._switchTab(this._tablist.currentTabIndex - 1);
          }
          break;
        // ctrl + page down
        case 34:
          if (e.ctrlKey) {
            e.preventDefault();
            // focus the next tab
            this._switchTab(this._tablist.currentTabIndex + 1);
          }
          break;

        // focus back to tab
        // ctrl + up
        case 38:
          if (e.ctrlKey) {
            e.preventDefault();
            // focus linked tab
            this._switchTab(this._tablist.currentTabIndex);
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

      this._tablist.currentTabIndex = this._tablist.tabPanels.indexOf(tabPanel);

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

      if (this._tablist.currentTabIndex === undefined) {
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
          this._switchTab(this._tablist.tabs.length - 1);
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
          this._switchTab(this._tablist.currentTabIndex - 1);
          break;

        // right
        case 39:
        // down
        case 40:
          e.preventDefault();
          // focus the next tab
          this._switchTab(this._tablist.currentTabIndex + 1);
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
      this._tablist.tabs.forEach((tab, index) => {
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
      if (this._tablist.tabs[index] && this._tablist.tabs[index].disabled) {

        // cycling forward? Then go one item farther
        const newIndex = index > this._tablist.currentTabIndex ? index + 1 : index - 1;

        this._switchTab(newIndex);

        return;
      }

      this._tablist.currentTabIndex = index;

      if (this._tablist.currentTabIndex < this._firstActiveTab()) {
        this._tablist.currentTabIndex = this._tablist.tabsLength - 1;
      } else if (this._tablist.currentTabIndex >= this._tablist.tabsLength) {
        this._tablist.currentTabIndex = this._firstActiveTab();
      }

      this._tablist.tabs[this._tablist.currentTabIndex].focus();
    }

    /**
     * Toggle the `aria-hidden` attribute on the tabpanel based on the passed tab
     * @param {integer} index - index of the tab
     * @param {boolean} show - whether or not display the panel
     */
    _toggleDisplay(index, show = true) {
      if (show && index === this._tablist.openedIndex) {
        return;
      }

      const tab = this._tablist.tabs[index];
      const tabPanel = this._tablist.tabPanels[index];

      // close the previous tab
      if (show && this._tablist.openedIndex !== undefined) {
        this._toggleDisplay(this._tablist.openedIndex, false);
      }

      tabPanel.setAttribute('aria-hidden', !show);

      if (show) {
        this._tablist.openedIndex = index;

        if (this._tablist.openedIndex !== undefined) {
          this._trigger('show', [tab, tabPanel]);
        }
      } else if (this._tablist.openedIndex !== undefined) {
        this._trigger('hide', [tab, tabPanel]);
      }
    }

    _trigger(eventName, params) {
      if (!this._callbacks[eventName]) {
        return;
      }

      this._callbacks[eventName].forEach(callback => {
        callback.apply(this, params);
      });
    }

    /**
     * Parse tablist element to setup the tab and tabpanel elements
     */
    mount() {
      let firstTabIndex;

      // create reference arrays
      this._tablist.tabs = [];
      this._tablist.tabPanels = [];

      // loop on each tab elements to find tabpanel elements and update their attributes
      Array.prototype.slice.call(this.el.querySelectorAll('[role=tab]')).forEach((tab, index) => {
        const controls = tab.getAttribute('aria-controls');
        let tabPanel;
        let openedTab = false;

        // get the tabpanel linked to the tab element
        if (controls) {
          tabPanel = document.getElementById(controls);
        } else if (tab.nextElementSibling && tab.nextElementSibling.getAttribute('aria-labelledby') === tab.id) {
          tabPanel = tab.nextElementSibling;
        }

        if (!tabPanel) {
          throw new Error(`Could not find associated tabpanel for tab ${tab.id}. Use [aria-controls="tabpanelId"] on the [role="tab"] element to link them together`);
        }

        // store the tab and the tabpanel on their respective arrays on the tablist
        this._tablist.tabs.push(tab);
        this._tablist.tabPanels.push(tabPanel);

        tab.disabled = tab.hasAttribute('disabled') || tab.getAttribute('aria-disabled') === 'true';

        // if there's no opened tab yet
        if (tab.getAttribute('data-open') === 'true' && !tab.disabled) {
          if (this._tablist.openedIndex === undefined) {
            this._toggleDisplay(index, true);

            openedTab = true;
          }
        }

        // remove setup data attributes
        tab.removeAttribute('data-open');

        // get first non-disabled tab
        if (firstTabIndex === undefined && !tab.disabled) {
          firstTabIndex = index;
        }

        // set the attributes according the the openedTab status
        tab.setAttribute('tabindex', -1);
        tabPanel.setAttribute('aria-hidden', !openedTab);

        // subscribe internal events for tab and tap panel
        tab.addEventListener('click', this._handleDisplay);
        tab.addEventListener('focus', this._handleFocus);
        tab.addEventListener('keydown', this._handleTab);
        tabPanel.addEventListener('focus', this._handlePanelFocus, true);
        tabPanel.addEventListener('keydown', this._handlePanel);
      });

      // store constants
      this._tablist.tabsLength = this._tablist.tabs.length;
      this._tablist.tabPanelsLength = this._tablist.tabPanels.length;

      // set the tabindex so the first opened tab or the first non-disabled tab can be focused on tab navigation
      if (this._tablist.openedIndex !== undefined) {
        this._tablist.tabs[this._tablist.openedIndex].setAttribute('tabindex', 0);
        this._tablist.tabs[this._tablist.openedIndex].setAttribute('aria-selected', 'true');
      }
      // if there's no opened tab and it's not an accordion open the first tab
      else {
          this._toggleDisplay(firstTabIndex, true);

          this._tablist.tabs[firstTabIndex].setAttribute('tabindex', 0);
          this._tablist.tabs[firstTabIndex].setAttribute('aria-selected', 'true');
        }
    }

    off(event, callback) {
      if (!this._callbacks[event]) {
        return;
      }

      const callbackIndex = this._callbacks[event].indexOf(callback);

      if (callbackIndex < 0) {
        return;
      }

      this._callbacks[event].splice(callbackIndex, 1);
    }

    on(event, callback) {
      if (callbackEvents.indexOf(event) < 0) {
        return;
      }

      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }

      this._callbacks[event].push(callback);
    }

    /**
     * Returns the opened tab or array of opened tabs
     */
    get current() {
      const tab = this._tablist.tabs[this._tablist.openedIndex];
      const tabPanel = this._tablist.tabPanels[this._tablist.openedIndex];

      return {
        tab,
        tabPanel
      };
    }

    /**
     * unbind tablist
     */
    unmount() {
      this._tablist.tabs.forEach((tab, index) => {
        const tabPanel = this._tablist.tabPanels[index];

        // unsubscribe internal events for tab and tap panel
        tab.removeEventListener('click', this._handleDisplay);
        tab.removeEventListener('focus', this._handleFocus);
        tab.removeEventListener('keydown', this._handleTab);

        tab.removeAttribute('tabindex');
        tab.removeAttribute('aria-selected');

        tabPanel.removeEventListener('focus', this._handlePanelFocus, true);
        tabPanel.removeEventListener('keydown', this._handlePanel);
        tabPanel.setAttribute('aria-hidden', 'false');
      });

      this._tablist = {};
    }
  }

  return Tablist;

})));
