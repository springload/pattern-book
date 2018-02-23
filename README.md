<p align="center">
  <img width="245" height="378" src="/logo.png" alt="Pattern Book"><br>
  <i>It's not a pattern library, it's a pattern book, so make your own library!</i>
</p>

---

Pattern-Book is a simple and tiny component that auto-detects your HTML and CSS and displays it, and that's all.

Unlike most Pattern Libaries, also known as Style Guides, there's no need to define components in the way that the framework understands. Instead Pattern-Book works with your existing components and it auto-detects the code being used.

Usage:

```javascript
import React, { Component } from "react";
import Book from "pattern-book";
import "h6.css"; // contains h6 { color: red; }

class PatternLibrary extends Component {
  render() {
    return (
      <div>
        <h4>Patterns</h4>
        <h5>Heading Patterns</h5>
        <hr />

        <Book>
          <h6>My Heading 6</h6>
        </Book>
      </div>
    );
  }
}
```

Will look like

<blockquote>
    <h4>Patterns</h4>
    <h5>Heading Patterns</h5>
    <hr>
    <div>
      <h6>My Heading 6</h6>
      <details><summary>HTML</summary>&lt;h6&gt;My Heading 6&lt;/h6&gt;</details>
      <details><summary>CSS</summary>h6 { color: red; }</details>
    </div>    
</blockquote>

### Q. This is a pattern library so where's the outdated dev webserver with broken hot reloading?

Great question.

`pattern-book` doesn't include a dev server because other projects do it better.

So instead just use [Create-React-App](https://github.com/facebookincubator/create-react-app) or, add `<Book>` tags to a new route in your app, or use whatever boilerplate you like.

### Q. How does pattern-book organise the page of patterns... with headings, accordions, tabs, or what?

It doesn't organise them, so design it however you want!

Imagine if your pattern library had 5 components then it probably should be organised quite differently to another library with 1000 components, so this software is unopinionated about organisation. Pattern-Book just renders the component preview so decide for yourself how to organise them (do try [react-accessible-accordion](https://github.com/springload/react-accessible-accordion/) though!).

### Q. How can I make patterns for an existing website?

One of the advantages of Pattern-Book is that it detects the CSS Rules being applied, so you can put your entire site's CSS files on the page and then write HTML that uses them and Pattern-Book will only display the relevant CSS (no need to manually associate CSS with a particular `<Book>`). This means that it's hopefully a lot less effort to repurpose your existing CSS as a pattern library.

## Features

* [x] Minimal
* [x] CSS Autodetection, so there's no need to manually associate CSS with a pattern
* [x] HTML beautifier

## ToDo

* [ ] CSS Beautifier
* [ ] ZIP download of particular components (including assets, eg backgrounds images and fonts).
* [ ] CSS Rule blacklist (and whitelist?) per-book
* [ ] ...and show prop types, somehow? (`prop-types` or Flow/TS?). Sadly I'm not sure how we could support FlowType/TypeScript types because those are removed at compile-time.
* [ ] Detect basic JSX React Components... this is almost working
* [ ] Render prop overrides for HTML and CSS (and the whole render()?)
* [ ] Make it support interactive components (eg accumulating CSS across these multiple states).
* [ ] Make the `<Book>` not render until it scrolls into view (pattern libraries are notorious for having hundreds of compnents on a long page, so this is hopefully an easy optimisation).
* [ ] Parse SourceMaps to derive Sass (etc) if possible.
