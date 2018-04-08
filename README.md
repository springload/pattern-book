<p align="center">
  <img width="245" height="378" src="/logo.png" alt="Pattern Book"><br>
  <i>A pattern library designed to be easier to maintain</i>
</p>

A pattern library, also known as a style guide, is a way of showing HTML and CSS for components (React components, or plain HTML).

---

## Q. How can I make patterns for an existing website?

One of the advantages of Pattern-Book is that it detects the CSS Rules being applied, so you can put your entire site's CSS files on the page and then write HTML that uses them and Pattern-Book will only display the relevant CSS (no need to manually associate CSS with a particular `<Book>`). This means that it's hopefully a lot less effort to repurpose your existing CSS as a pattern library.

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

<blockquote><h5>Heading Patterns</h5><hr><div><h6>My Heading 6</h6><details><summary>HTML</summary>&lt;h6&gt;My Heading 6&lt;/h6&gt;</details><details><summary>CSS</summary>h6 { color: red; }</details></div></blockquote>

## Q. This is a pattern library so where's the dev webserver?

Great question.

`pattern-book` doesn't include a dev server because other projects do it better.

So instead just use <a href="https://github.com/facebookincubator/create-react-app">Create-React-App</a> or, add `<Book>` tags to a new route in your existing app, or use whatever boilerplate you like.

Pattern-Book is very specifically targetting just the render and code preview of your components.

## Q. How does pattern-book organise the page of patterns... with headings, accordions, tabs, or what?

Imagine that your pattern library had 5 components then it probably should be organised quite differently to another library with 1000 components, so this software is unopinionated about organisation. Pattern-Book just renders the component preview so decide for yourself how to organise them (do try <a href="https://github.com/springload/react-accessible-accordion/">[react-accessible-accordion</a> though!).

<p>So, long story short, it doesn't organise them, so design it however you want! (headings are nice and simple though)</p>

# Code Preview Themes

<p>Use `pattern-book/theme/solarize.css`.</p>

<h3>Features</h3>

<ul>
 <li> [x] Minimal
 <li> [x] React
 <li> [x] CSS Autodetection, so there's no need to manually associate CSS with a component
 <li> [x] HTML beautifier
 <li> [x] CSS beautifier
 <li> [x] CSS rule whitelist and blacklist. Pass in 'blacklist' prop with value of 'stylesheet' to string match against attributes of `&lt;link&gt;` or `&lt;style&gt;`, 'stylesheets' to pass in an array of those, or 'rule' to match against selectors, or rules for an array of those.
  <li> [ ] CSS Rule whitelist (probably only useful to opt-in specific stylesheets while ignoring others)
 <li> [x] Render prop overrides for HTML and CSS
</ul>

## Who's using it? / Demo

* [LIC Pattern Library](https://springload.github.io/lic-pattern-library/)

You? [Tweet me](http://twitter.com/hollowaynz) to be added.

<h3>ToDo</h3>

<ul>
 <li> [ ] ZIP download of particular components (including assets, eg backgrounds images and fonts).
 <li> [ ] ...and show prop types, somehow? (`prop-types` or Flow/TS?). Sadly I'm not sure how we could support FlowType/TypeScript types because those are removed at compile-time.
 <li> [ ] Detect basic JSX React Components... this is almost working
 <li> [ ] Make it support interactive components (eg accumulating CSS across these multiple states).
 <li> [ ] Make the `&lt;Book&gt;` not render until it scrolls into view (pattern libraries are notorious for having hundreds of compnents on a long page, so this is hopefully an easy optimisation)
 <li> [ ] Parse SourceMaps to derive Sass (etc) if possible.
</ul>
