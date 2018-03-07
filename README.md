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
    <h5>Heading Patterns</h5>
    <hr>
    <div>
      <h6>My Heading 6</h6>
      <details><summary>HTML</summary>&lt;h6&gt;My Heading 6&lt;/h6&gt;</details>
      <details><summary>CSS</summary>h6 { color: red; }</details>
    </div>    
</blockquote>

<h2>Q. This is a pattern library so where's the outdated dev webserver with broken hot reloading?</h2>

<p>Great question.

<p>`pattern-book` doesn't include a dev server because other projects do it better.

<p>So instead just use [Create-React-App](https://github.com/facebookincubator/create-react-app) or, add `&lt;Book&gt;` tags to a new route in your app, or use whatever boilerplate you like.

<h2>Q. How does pattern-book organise the page of patterns... with headings, accordions, tabs, or what?</h2>

<p>It doesn't organise them, so design it however you want!

<p>Imagine if your pattern library had 5 components then it probably should be organised quite differently to another library with 1000 components, so this software is unopinionated about organisation. Pattern-Book just renders the component preview so decide for yourself how to organise them (do try <a href="https://github.com/springload/react-accessible-accordion/">[react-accessible-accordion</a> though!).

<h2>Q. How can I make patterns for an existing website?</h2>

<p>One of the advantages of Pattern-Book is that it detects the CSS Rules being applied, so you can put your entire site's CSS files on the page and then write HTML that uses them and Pattern-Book will only display the relevant CSS (no need to manually associate CSS with a particular `&lt;Book&gt;`). This means that it's hopefully a lot less effort to repurpose your existing CSS as a pattern library.

<h3>Features</h3>

<ul>
 <li> [x] Minimal
 <li> [x] CSS Autodetection, so there's no need to manually associate CSS with a pattern
 <li> [x] HTML beautifier
</ul>

<h3>ToDo</h3>

<ul>
 <li> [ ] CSS Beautifier
 <li> [ ] ZIP download of particular components (including assets, eg backgrounds images and fonts).
 <li> [ ] CSS Rule blacklist (and whitelist?) per-book
 <li> [ ] ...and show prop types, somehow? (`prop-types` or Flow/TS?). Sadly I'm not sure how we could support FlowType/TypeScript types because those are removed at compile-time.
 <li> [ ] Detect basic JSX React Components... this is almost working
 <li> [ ] Render prop overrides for HTML and CSS (and the whole render()?)
 <li> [ ] Make it support interactive components (eg accumulating CSS across these multiple states).
 <li> [ ] Make the `&lt;Book&gt;` not render until it scrolls into view (pattern libraries are notorious for having hundreds of compnents on a long page, so this is hopefully an easy optimisation).
 <li> [ ] Parse SourceMaps to derive Sass (etc) if possible.
</ul>
