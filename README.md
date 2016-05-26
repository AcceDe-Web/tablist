# AcceDe Web - tablist

WAI-ARIA accordion and tab plugin without dependencies.

## Requirements

### HTML

Basic HTML structure with roles `tablist`, `tab`, and `tabpanel`. `aria-multiselectable` attribute on the tab list and `aria-labelledby` attribute on each tab panels when wanting an accordion instead of tabs. `id` attribute either on the tabs or the tab panel whether we want an accordion or tabs.

#### Example of accordion HTML structure

```html
<div role="tablist" aria-multiselectable="true">
  <h3 id="tab1" role="tab">Header 1</h3>
  <div role="tabpanel" aria-labelledby="tab1">
    <p>---</p>
  </div>
  <h3 id="tab2" role="tab">Header 2</h3>
  <div role="tabpanel" aria-labelledby="tab2">
    <p>---</p>
  </div>
  <h3 id="tab3" role="tab">Header 3</h3>
  <div role="tabpanel" aria-labelledby="tab3">
    <p>---</p>
  </div>
  <h3 id="tab4" role="tab">Header 4</h3>
  <div role="tabpanel" aria-labelledby="tab4">
    <p>---</p>
  </div>
</div>
```

#### Example of tabs HTML structure

```html
<ul role="tablist">
  <li role="tab" aria-controls="tab-1">Tab 1</li>
  <li role="tab" aria-controls="tab-2">Tab 2</li>
  <li role="tab" aria-disabled="true" aria-controls="tab-3">Tab 3</li>
  <li role="tab" aria-controls="tab-4">Tab 4</li>
</ul>

<div role="tabpanel" id="tab-1">
  <p>---</p>
</div>
<div role="tabpanel" id="tab-2">
  <p>---</p>
</div>
<div role="tabpanel" id="tab-3">
  <p>---</p>
</div>
<div role="tabpanel" id="tab-4">
  <p>---</p>
</div>
```

An `aria-disabled` attribute set to `true` on a `tab` will disable the `tab` and the associated `tabpanel` making them unfocusable and unselectable.

If you wish to open one or more specific tab when the script starts, just add the `data-tab-open` attribute on the desired `tab`:

```html
<ul role="tablist">
  <li role="tab" aria-controls="tab-1">Tab 1</li>
  <li role="tab" aria-controls="tab-2" data-tab-open>Tab 2</li>
  <li role="tab" aria-controls="tab-3">Tab 3</li>
  <li role="tab" aria-controls="tab-4">Tab 4</li>
</ul>

<!-- -->
```

### CSS

At least a <abbr title="Cascading Style Sheets">CSS</abbr> selector for panels to be hidden when not selected:

```css
[role=tabpanel][aria-hidden=true] {
  display: none;
}
```

The selector can be anything you want, like a class, as the script allows callback when opening or closing a panel; you can add your own class using the callbacks.

### JavaScript

The script itself, either from npm:

```bash
$ npm install accedeweb-tablist
```

and later in your code:

```js
var Tablist = require( 'accedeweb-tablist' );

// or

import Tablist from accedeweb-tablist;
```

or downloaded from Github and added to the page (minified and non minified versions available in the `lib` folder )

```html
<script src="./js/accedeweb-tablist.min.js"></script>
```

Using the later, the script will be available on `window` under the namespace `Tablist`.

Now to kick off the script:

```js
var list = document.querySelector( '[role="tablist"]' );
var tablist = new window.Tablist( list );

// or you can pass callbacks

var tablist = new window.Tablist( list, {
  openTab: openTabCallback,
  closeTab: closeTabCallback
});
```

## Parameters

The script takes two parameters:

* the `tablist` <abbr title="Document Object Model">DOM</abbr> element
* an optional object with two callbacks:
  * `openTab` callback will be executed when a new tab is open, passing the current tab <abbr title="Document Object Model">DOM</abbr> element as a parameter
  * `closeTab` callback will be executed when a tab is closed, passing the closed tab <abbr title="Document Object Model">DOM</abbr> element as a parameter

As the script takes only one `tablist` element as parameter you have to loop over each `tablist` to kick off the script on each of them.

```js
var lists = document.querySelectorAll( '[role="tablist"]' );

Array.prototype.forEach.call( lists, function( list ) {
  new window.Tablist( list );
});
```

## Methods

The `Tablist` constructor returns two methods:

* `closeAll` will allow you to close all the panels, except when in tab mode as at least one panel must be displayed
* `openedTab` will return an array of opened tabs

## References

Each `tab` and `tabpanel` have references to the `tablist` element and `tab` or `tabpanel`:

```js
function openCallback( openTab ){
  console.log( openTab.tabList );
  // -> returns the parent DOM element with the role 'tablist'

  console.log( opentTab.tabPanel );
  // -> returns the tabpanel DOM element linked to the tab
}
```

This allows you to add or remove your own `class` for <abbr title="Cascading Style Sheets">CSS</abbr> purposes or animate the opening or closing of the tab panel.

## Keyboard Interaction

The keyboard interactions are based on [Atalan's AcceDe Web guidelines (in French)](http://www.accede-web.com/notices/interface-riche/accordeons/) and [the WAI-AIRA 1.0 Authoring Practices](https://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#tabpanel)

* `Tab` - only the active tab is in the tab order. The user reaches the tabbed panel component by pressing the tab key until the active tab title receives focus.
* `Left Arrow` - with focus on a tab, pressing the left arrow will move focus to the previous tab in the tab list and activate that tab. Pressing the left arrow when the focus is on the first tab in the tab list will move focus and activate the last tab in the list.
* `Right Arrow` - with focus on a tab, pressing the right arrow will move focus to the next tab in the tab list and activate that tab. Pressing the right arrow when the focus is on the last tab in the tab list will move focus to and activate the first tab in the list.
* `Up arrow` - behaves the same as left arrow in order to support vertical tabs.
* `Down arrow` - behaves the same as right arrow in order to support vertical tabs.
* `Control+Up Arrow` - with focus anywhere within the tab panel, pressing Control+Up Arrow will move focus to the tab for that panel. This is not standard behavior.
* `Control+PageUp` - When focus is inside of a tab panel, pressing Control+PageUp moves focus to the tab of the previous tab in the tab list and activates that tab. When focus is in the first tab panel in the tab list, pressing Control+PageUp will move focus to the last tab in the tab list and activate that tab.
* `Control+PageDown` When focus is inside of a tab panel, pressing Control+PageDown moves focus to the tab of the next tab in the tab list and activates that tab. When focus is in the last tab panel in the tab list, pressing Control+PageUpwill move focus to the first tab in the tab list and activate that tab.


## Testing

Install the project dependencies:

```bash
  $ npm install
```

Run the automated test cases:

```bash
  $ npm test
```
