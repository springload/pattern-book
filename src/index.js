import React, { PureComponent } from "react";
import XMLBeautify, {
  OUTPUT_FORMATS as XML_OUTPUT_FORMATS
} from "xml-zero-beautify";
import CSSBeautify, {
  OUTPUT_FORMATS as CSS_OUTPUT_FORMATS
} from "css-zero-beautify";

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
    // this.updateJSX();
  }

  updateHTML() {
    const html = XMLBeautify(this.container.innerHTML, {
      html: true,
      output: XML_OUTPUT_FORMATS.html
    });

    this.setState({ html });
  }

  updateJSX() {
    const { children } = this.props;
    let jsx = React.Children.map(children, this.updateJSXChildren).join("");

    jsx = XMLBeautify(this.container.innerHTML, {
      html: true,
      output: XML_OUTPUT_FORMATS.html
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
    const children = [...this.container.childNodes];

    const rawCSS = children.map(this.updateCSSChildren).join("");

    const css = CSSBeautify(rawCSS, {
      output: CSS_OUTPUT_FORMATS.html
    });

    this.setState({ css });
  }

  updateCSSChildren(child) {
    if (!child.getAttribute) return; // probable text node which can't have CSS
    let css = "";
    const style = child.getAttribute("style");
    if (style) {
      css += `/* inline style on '${child.name}' ${style} */\n`;
    }
    css += getCSS(child).join("");
    if (child.childNodes) {
      const children = [...child.childNodes];
      css += children.map(this.updateCSSChildren).join("");
    }
    return css;
  }

  render() {
    const { renderChildren, children, renderHTML, renderCSS } = this.props;
    const { visible, height, html, jsx, css } = this.state;

    if (!visible) return <div style={{ height }} />;

    const kids = (
      <div
        ref={container => {
          this.container = container;
        }}
        onClick={this.updateBook}
        className="pattern-book__example"
      >
        {children}
      </div>
    );

    return (
      <div className="pattern-book">
        {renderChildren ? renderChildren(kids) : kids}
        <details className="pattern-book__html">
          <summary>HTML</summary>
          {renderHTML ? (
            renderHTML(html)
          ) : (
            <code dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </details>
        <details className="pattern-book__css">
          <summary>CSS</summary>
          {renderCSS ? (
            renderCSS(css)
          ) : (
            <code dangerouslySetInnerHTML={{ __html: css }} />
          )}
        </details>
      </div>
    );
  }
}

const getCSS = el => {
  const sheets = window.document.styleSheets;
  let matchedRules = [];

  el.matches =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector ||
    el.oMatchesSelector;

  for (let i in sheets) {
    let rules = sheets[i].rules || sheets[i].cssRules;
    matchedRules = matchedRules.concat(testRules(el, rules));
  }
  return matchedRules;
};

const testRules = (el, rules) => {
  const matchedRules = [];
  for (let r in rules) {
    const rule = rules[r];
    if (rule.selectorText) {
      if (el.matches(rule.selectorText)) {
        matchedRules.push(rule.cssText);
      }
    } else if (rule.rules || rule.cssRules) {
      // a nested rule like @media { rule { ... } }
      const nestedRules = testRules(el, rule.rules || rule.cssRules);
      if (nestedRules.length) {
        // TODO: distinguish between other nested types?
        let cssText = "@media ";
        cssText += rule.conditionText;
        cssText += " {";
        cssText += nestedRules.join(" ");
        cssText += "}";
        matchedRules.push(cssText);
      }
    }
  }
  return matchedRules;
};
