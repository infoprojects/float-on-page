# float-on-page
Keep element in viewport when scrolling the page, but within limits.
Can be used for parts like a 'shopping basket', a paging component, an 'on this page' bookmarks section, etc.

When you apply this feature to a such a component:
- when you scroll the page, and the component hits the above browser edge, it will 'stick' floating;
- but, when it will probably hit a following section on the page (for example, the footer), it will be nailed to the page again to be scrolled out of view.

## Getting started
- `yarn` : fetches dependencies, etc.
- `gulp` : run default build and starts local server, watching resources to hot reload results
- `gulp build` : cleans distribution folder and builds package

## Usage
1. Include jQuery
2. Include float-on-page.js
3. Select an element you want to apply the feature to, and activate it, such as:
```
  $(".my-element").floatOnPage({"stopAt", "footer"});
```

### Config options
- `stopAt` (required, jQuery selection path) -> element that would cause a collision, and will nail the floating element back on the page;
- `minWidth` (optional, int pixels) -> minimal viewport width for the behaviour to act, for example:
```
$(".sidebar-element:has(.paging-feature)").floatOnPage({"stopAt": "footer", "minSize": 920});
```

### Notes
- Floating element should have dimensions (width/height);
- `stopAt` element should be positioned (and thus have a measurable `getBoundingClientRect().top`)

## Credits
Thanks to http://www.cheeseipsum.co.uk/ for generating dummy text
