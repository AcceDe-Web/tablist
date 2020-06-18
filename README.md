# AcceDe Web - tablist

WAI-ARIA tab plugin without dependencies.

## Requirements

### HTML

Basic HTML structure with roles `tablist`, `tab`, and `tabpanel`.

#### HTML structure

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

If you wish to open one specific tab when the script starts, just add the `data-open` attribute with the value of `true` on the desired `tab`:

```html
<ul role="tablist">
  <li role="tab" aria-controls="tab-1">Tab 1</li>
  <li role="tab" aria-controls="tab-2" data-open="true">Tab 2</li>
  <li role="tab" aria-controls="tab-3">Tab 3</li>
  <li role="tab" aria-controls="tab-4">Tab 4</li>
</ul>

<!-- -->
```

### CSS

At least a <abbr title="Cascading Style Sheets">CSS</abbr> selector for panels to be hidden when not selected for [legacy browsers](https://caniuse.com/#feat=hidden) compatibility (Internet Explorer < 11>):

```css
[role=tabpanel][hidden] {
  display: none;
}
```

The selector can be anything you want, like a class, as the script allows callback when opening or closing a panel; you can add your own class using the callbacks.

### JavaScript

The script itself, either from npm:

```bash
$ npm install @accede-web/tablist
```

and later in your code:

```js
var Tablist = require( '@accede-web/tablist' );

// or

import Tablist from @accede-web/tablist
```

or downloaded from Github and added to the page (minified and non minified versions available in the `dist` folder)

```html
<script src="./js/tablist.min.js"></script>
```

Using the later, the script will be available on `window` under the namespace `Tablist`.

Now to kick off the script:

```js
// get the tablist element
var list = document.querySelector( '[role="tablist"]' );

// create the tablist instance
var tablist = new Tablist( list );

// optionnaly add callbacks to on show and hide a tab
tablist.on( 'show', function( tab, tabPanel ){
  …
});

tablist.on( 'hide', function( tab, tabPanel ){
  …
});

// start the plugin
tablist.mount();
```

## Parameters

The script takes one parameter:

* the `tablist` <abbr title="Document Object Model">DOM</abbr> element

As the script takes only one `tablist` element as parameter you have to loop over each `tablist` to kick off the script on each of them.

```js
var lists = document.querySelectorAll( '[role="tablist"]' );

Array.prototype.forEach.call( lists, function( list ) {
  new Tablist( list ).mount();
});
```

## Methods

The `Tablist` constructor returns 4 methods:

* `mount()` - bind all events and apply required attributes
* `unmount()` - unbind keyboard and mouse events
* `on( event, callback )` - bind a callback to either the `show` or `hide` event triggered when changing tab. Both `tab` and `tabPanel` HTMLElement are passed on the callback
* `off( event, callback )` - unbind a callback to either the `show` or `hide` event triggered when changing tab

## Properties

To know which `tab` and `tabPanel` is open use `tablist.current`. It will return an object containing `tab` and `tabPanel`

```js
// ES6 destructuring array
const { tab, tabPanel } = tablist.current;

tab; // return the `tab`
tabPanel; // return the `tabPanel`

// ES5
var elements = tablist.current;

elements.tab; // return the `tab`
elements.tabPanel; // return the `tabPanel`
```

## Keyboard Interaction

The keyboard interactions are based on [Atalan's AcceDe Web guidelines (in French)](http://www.accede-web.com/notices/interface-riche/accordeons/) and [the WAI-AIRA 1.0 Authoring Practices](https://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#tabpanel)

* `Tab` - only the active tab is in the tab order. The user reaches the tabbed panel component by pressing the tab key until the active tab title receives focus.
* `Left Arrow` - with focus on a tab, pressing the left arrow will move focus to the previous tab in the tab list and activate that tab. Pressing the left arrow when the focus is on the first tab in the tab list will move focus and activate the last tab in the list.
* `Right Arrow` - with focus on a tab, pressing the right arrow will move focus to the next tab in the tab list and activate that tab. Pressing the right arrow when the focus is on the last tab in the tab list will move focus to and activate the first tab in the list.
* `Up arrow` - behaves the same as left arrow in order to support vertical tabs.
* `Down arrow` - behaves the same as right arrow in order to support vertical tabs.
* `Home` - with focus on a tab, pressing the Home key will move the focus to the first tab
* `End` - with focus on a tab, pressing the End key will move the focus to the last tab
* `Control+Up Arrow` - with focus anywhere within the tab panel, pressing Control+Up Arrow will move focus to the tab for that panel. This is not standard behavior.
* `Control+PageUp` - When focus is inside of a tab panel, pressing Control+PageUp moves focus to the tab of the previous tab in the tab list and activates that tab. When focus is in the first tab panel in the tab list, pressing Control+PageUp will move focus to the last tab in the tab list and activate that tab.
* `Control+PageDown` When focus is inside of a tab panel, pressing Control+PageDown moves focus to the tab of the next tab in the tab list and activates that tab. When focus is in the last tab panel in the tab list, pressing Control+PageUpwill move focus to the first tab in the tab list and activate that tab.


## Compatibilty

This plugin is tested against the following browsers:

* Internet Explorer 9 and higher
* Microsoft Edge
* Chrome
* Firefox
* Safari


## Testing

Install the project dependencies:

```bash
$ npm install
```

Run the automated test cases:

```bash
$ npm test
```
