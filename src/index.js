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
      // jsx: [],
      css: []
    };

    this.updateBook = this.updateBook.bind(this);
    this.updateHTML = this.updateHTML.bind(this);
    // this.updateJSX = this.updateJSX.bind(this);
    // this.updateJSXChildren = this.updateJSXChildren.bind(this);
    this.updateCSS = this.updateCSS.bind(this);
    this.updateCSSChildren = this.updateCSSChildren.bind(this);
  }

  componentDidMount() {
    this.updateBook();
  }

  updateBook() {
    this.updateHTML();
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

    const cssChildren = [].concat
      .apply(
        [], children.map(this.updateCSSChildren)
      ).sort((a, b) => a[0] > b[0]);

    const cssChildrenKeys = cssChildren.map(cssChild => cssChild && cssChild[0]);

    const rawCSS = cssChildren
      .filter((cssChild, i) => {
        if (!cssChild) return false;
        const cssChildrenKeysIndex = cssChildrenKeys.indexOf(cssChild[0]);
        return (
          cssChildrenKeysIndex === i || // if it's not unique
          cssChild[1] !== cssChildren[cssChildrenKeysIndex][1] // OR if it's different CSS. eg. different matching CSS rules inside a @media
        );
      })
      .map(cssChild => cssChild[1])
      .join("");

    const css = CSSBeautify(rawCSS, {
      output: CSS_OUTPUT_FORMATS.html
    });

    this.setState({ css });
  }

  updateCSSChildren(child) {
    if (!child.getAttribute) return; // probable text node which can't have CSS
    let css = [];
    const style = child.getAttribute("style");
    if (style) {
      css.push(`/* inline style on '${child.name}' ${style} */\n`);
    }
    css = css.concat(getCSS(child));
    if (child.childNodes) {
      const children = [...child.childNodes];
      css = [].concat.apply(css, children.map(this.updateCSSChildren));
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
    matchedRules = matchedRules.concat(testRules(el, rules, i));
  }
  return matchedRules;
};

const testRules = (el, rules, groupId) => {
  const matchedRules = [];
  for (let i in rules) {
    const rule = rules[i];
    const ruleGroupId = `${groupId}-${i}`;
    if (rule.selectorText) {
      if (el.matches(rule.selectorText)) {
        matchedRules.push([ruleGroupId, rule.cssText]);
      }
    } else if (rule.rules || rule.cssRules) {
      // a nested rule like @media { rule { ... } }
      // so we test the rules inside
      const nestedRules = testRules(
        el,
        rule.rules || rule.cssRules,
        ruleGroupId
      );
      if (nestedRules.length) {
        // TODO: distinguish between other nested types?
        let cssText = "@media ";
        cssText += rule.conditionText;
        cssText += " {";
        cssText += nestedRules.map(rule => rule[1]).join(" ");
        cssText += "}";
        matchedRules.push([ruleGroupId, cssText]);
      }
    }
  }
  return matchedRules;
};
