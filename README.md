# pattern-book.js

It's not a pattern library, it's a pattern book, so make your own library.

It wraps arbitrary HTML or React Components and displays them as HTML, JSX, and CSS.

Usage:

```
import React, { Component } from 'react';
import Book from 'pattern-book';
import 'h6.css'; // contains h6 { color: red; }

class PatternLibrary extends Component {
  render() {
    return (
      <Book>
        <Heading>My Heading</Heading>
      </Book>
    );
  }
}

const Heading = ({ children }) => (
  <h6>{children}</h6>
)
```

It will then render something like,

<blockquote>
    <details><summary>HTML</summary>&lt;h6&gt;My Heading&lt;/h6&gt;</details>
    <details><summary>JSX</summary>&lt;Heading&gt;My Heading&lt;/Heading&gt;</details>
    <details><summary>CSS</summary>h6 { color: red; }</details>
    <h6>My Heading</h6>
</blockquote>

.

There's support for both HTML and JSX so that you can expose different levels of markup complexity. In JSX you will see React Components and html tags, whereas HTML will only have html.

The CSS is automatically derived from the styles applied to the wrapped elements (it uses browser APIs to determine this, so there's no need to manually associate CSS with a component).

## FAQ

### Q. Where's the dev server with hot reloading?

I don't know but it's not here. Just use [Create-React-App](https://github.com/facebookincubator/create-react-app) or, add `<Book>` tags to a new page in your app, or use whatever boilerplate you like.

### Q. How do I organise the books with titles, accordian sections, or titles?

Well `pattern-book` just renders the component preview so use [react-accessible-accordion](https://github.com/springload/react-accessible-accordion/), or put headings between them. Design it however you want. I don't care.

## TODO

* Pretty-print the HTML / JSX / CSS.
* Make it support interactive components (with while accumulating the CSS across these multiple states).
* Make the Book not render until it scrolls into view (pattern libraries are notorious for having hundreds of compnents, so this is an easy optimisation).
* Tests

