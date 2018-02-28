import React, { PureComponent } from "react";
import Beautify, { OUTPUT_FORMATS } from "xml-zero-beautify";

const DEFAULT_HEIGHT = 100;

export default class PatternBook extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      height: props.height || DEFAULT_HEIGHT,
      html: [],
      jsx: [],
      css: []
    };

    this.updateBook = this.updateBook.bind(this);
    this.updateHTML = this.updateHTML.bind(this);
    this.updateJSX = this.updateJSX.bind(this);
    this.updateJSXChildren = this.updateJSXChildren.bind(this);
    this.updateCSS = this.updateCSS.bind(this);
    this.updateCSSChildren = this.updateCSSChildren.bind(this);
  }

  componentDidMount() {
    this.updateBook();
  }

  updateBook() {
    this.updateHTML();
    this.updateJSX();
    this.updateCSS();
  }

  updateHTML() {
    const html = Beautify(this.container.innerHTML, {
      html: true,
      output: OUTPUT_FORMATS.html
    });

    this.setState({
      html
    });
  }

  updateJSX() {
    const { children } = this.props;
    let jsx = React.Children.map(children, this.updateJSXChildren).join("");

    jsx = Beautify(this.container.innerHTML, {
      html: true,
      output: OUTPUT_FORMATS.html
    });

    this.setState({
      jsx
    });
  }

  updateJSXChildren(child) {
    if (!child) return;
    else if (typeof child === "string") {
      return child;
    }
    let tag = "<";
    const tagName =
      typeof child.type === "string" ? child.type : child.type.name;
    tag += tagName;

    Object.keys(child.props)
      .filter(key => key !== "children")
      .forEach(key => {
        tag += ` ${key}=`;
        tag +=
          typeof child.props[key] === "string"
            ? `"${child.props[key]}"`
            : `{${child.props[key]}}`;
      });
    if (child.props.children) {
      tag += ">";
      tag += React.Children.map(
        child.props.children,
        this.updateJSXChildren
      ).join("");
      tag += "</";
      tag += tagName;
      tag += ">";
    } else {
      tag += "/>";
    }
    return tag;
  }

  updateCSS() {
    const childNodes = this.container.childNodes;
    const children = Array.prototype.slice.call(childNodes);

    const css = children.map(this.updateCSSChildren).join("");

    // TODO pretty format CSS
    this.setState({
      css
    });
  }

  updateCSSChildren(child) {
    if (!child.getAttribute) return; // probable text node
    let css = "";
    const style = child.getAttribute("style");
    if (style) {
      css += `/* inline style on '${child.name}' ${style} */\n`;
    }
    css += getCSS(child);
    if (child.childNodes) {
      const children = Array.prototype.slice.call(child.childNodes);
      css += children.map(this.updateCSSChildren).join("");
    }
    return css;
  }

  render() {
    const { children } = this.props;
    const { visible, height, html, jsx, css } = this.state;

    if (!visible) return <div style={{ height }} />;

    return (
      <div className="pattern-book">
        <div
          ref={container => {
            this.container = container;
          }}
          onClick={this.updateBook}
          className="pattern-book__example"
        >
          {children}
        </div>
        <details className="pattern-book__html">
          <summary>HTML</summary>
          {<code dangerouslySetInnerHTML={{ __html: html }} /> || "(no HTML)"}
        </details>
        <details className="pattern-book__css">
          <summary>CSS</summary>
          {<code>{css}</code> || "(no css)"}
        </details>
      </div>
    );
  }
}

let getCSS = el => {
  var sheets = document.styleSheets,
    ret = [];
  el.matches =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector ||
    el.oMatchesSelector;
  for (var i in sheets) {
    var rules = sheets[i].rules || sheets[i].cssRules;
    for (var r in rules) {
      if (el.matches(rules[r].selectorText)) {
        ret.push(rules[r].cssText);
      }
    }
  }
  return ret;
};
