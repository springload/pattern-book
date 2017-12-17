import React, { PureComponent } from "react";

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
    const html = this.container.innerHTML;
    // TODO format HTML
    this.setState({
      html
    });
  }

  updateJSX() {
    const { children } = this.props;
    const jsx = React.Children.map(children, this.updateJSXChildren).join("");
    // TODO format HTML
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

    // TODO format CSS
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
      <div className="patternbook">
        <details className="patternbook__html">
          <summary>HTML</summary>
          {html || "(no HTML)"}
        </details>
        <details className="patternbook__jsx">
          <summary>JSX</summary>
          {jsx || "(no JSX)"}
        </details>
        <details className="patternbook__css">
          <summary>CSS</summary>
          {css || "(no css)"}
        </details>
        <div
          ref={container => {
            this.container = container;
          }}
          onClick={this.updateBook}
        >
          {children}
        </div>
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
