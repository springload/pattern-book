# pattern-book.js

It's not a pattern library, it's a pattern book, so make your own library.

It wraps arbitrary HTML or React Components and displays them as HTML, JSX, and CSS.

Usage:

```
import React, { Component } from 'pattern-book';
import Book from 'pattern-book';
import 'h6.css'; // contains h6 { color: red; }

export default class PatternLibrary {
  render() {
    return (
      <Book>
        <h6>My Heading</h6>
      </Book>
    );
  }
}
```

It will then render something like,

<blockquote>
    <details><summary>HTML</summary>&lt;h6&gt;My Heading&lt;/h6&gt;</details>
    <details><summary>JSX</summary>&lt;h6&gt;My Heading&lt;/h6&gt;</details>
    <details><summary>CSS</summary>h6 { color: red; }</details>
    <h6>My Heading</h6>
</blockquote>

The support for both HTML and JSX is so that you can expose different levels of markup complexity.

The CSS is automatically derived from the styles applied to the wrapped elements (it uses browser APIs to determine this, so there's no need to manually associate CSS with a component).

## FAQ

### Q. Where's the dev server with hot reloading?

I don't know but it's not here. Just use [Create-React-App](https://github.com/facebookincubator/create-react-app) or whatever boilerplate you like.

### Q. How do I organise the books with accordian sections, or titles?

Well `pattern-book` just renders the component preview so use [react-accessible-accordion](https://github.com/springload/react-accessible-accordion/), or put headings between them. Design it however you want.

## TODO

Make the book not render until it scrolls into view (pattern libraries are notorious for having hundreds of compnents, so this is an easy optimisation).