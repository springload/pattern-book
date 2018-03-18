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
    const rules = CSSSniff.getCSSRules([...this.container.childNodes]);
    const rawCSS = CSSSniff.serialize(rules);
    const css = CSSBeautify(rawCSS, {
      output: CSS_OUTPUT_FORMATS.html
    });
    this.setState({ css });
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

class CSSSniff {
  static serialize(rules) {
    if (!rules) return "";
    return Object.keys(rules)
      .map(key => {
        const rule = rules[key];
        let css = "";
        if (rule.selectors) {
          css += rule.selectors.join(",");
          css += rule.properties;
        } else if (rule.before) {
          css += rule.before;
          css += CSSSniff.serialize(rule.children);
          css += rule.after;
        } else if (rule instanceof Object) {
          css += CSSSniff.serialize(rule);
        }
        return css;
      })
      .join("");
  }

  static getCSSRules(children, matchedCSS) {
    return children.reduce((matchedCSS, child, i) => {
      matchedCSS = CSSSniff.getCSSRulesByElement(child, matchedCSS);
      if (child.childNodes)
        matchedCSS = CSSSniff.getCSSRules([...child.childNodes], matchedCSS);
      return matchedCSS;
    }, matchedCSS || {});
  }

  static getCSSRulesByElement(el, matchedCSS) {
    const matches =
      el.matches ||
      el.webkitMatchesSelector ||
      el.mozMatchesSelector ||
      el.msMatchesSelector ||
      el.oMatchesSelector;
    if (!matches) return matchedCSS; // presumed text node
    el.matches = matches;

    const sheets = window.document.styleSheets;
    for (let i in sheets) {
      const matchedCSSRule = CSSSniff._filterCSSRulesByElement(
        el,
        sheets[i].rules || sheets[i].cssRules,
        matchedCSS[i] || {}
      );
      if (matchedCSSRule) {
        matchedCSS[i] = matchedCSSRule;
      }
    }
    return matchedCSS;
  }

  static _filterCSSRulesByElement(el, rules, matchedCSS) {
    for (let i in rules) {
      const rule = rules[i];
      if (rule.selectorText) {
        // TODO split selectorText by separator
        // eg
        // selector = 'a,b'  -->  ['a','b']
        // BUT ALSO
        // selector = 'a[attr=','],b'  -->  'a[attr=\',\']', 'b']
        // Currently the splitting is naive
        const selectors = rule.selectorText.split(",");
        selectors.forEach(selector => {
          if (el.matches(selector)) {
            matchedCSS[i] = {
              selectors: (matchedCSS[i] && matchedCSS[i].selectors) || [],
              properties: rule.cssText.substring(rule.cssText.indexOf("{"))
            };
            if (matchedCSS[i].selectors.indexOf(selector) === -1) {
              matchedCSS[i].selectors.push(selector);
            }
          }
        });
      } else if (rule.rules || rule.cssRules) {
        // a nested rule like @media { rule { ... } }
        // so we filter the rules inside individually
        const nestedRules = CSSSniff._filterCSSRulesByElement(
          el,
          rule.rules || rule.cssRules,
          {}
        );
        if (nestedRules) {
          matchedCSS[i] = {
            before: "@media " + rule.conditionText + " {",
            children: nestedRules,
            after: "}"
          };
        }
      }
    }
    return Object.keys(matchedCSS).length ? matchedCSS : undefined;
  }
}
