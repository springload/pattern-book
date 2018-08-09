import React, { PureComponent } from "react";
import XMLBeautify, {
  OUTPUT_FORMATS as XML_OUTPUT_FORMATS
} from "xml-zero-beautify";
import CSSBeautify, {
  OUTPUT_FORMATS as CSS_OUTPUT_FORMATS,
  CSSZeroLexer,
  CSSZeroLexerNodeTypes
} from "css-zero-beautify";
import { saveAs } from "file-saver/FileSaver";
import JSZip from "jszip";

const DEFAULT_HEIGHT = 100;
const GLOBAL_NAMESPACE = "__PATTERN_BOOK_CART__";

export default class PatternBook extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      height: props.height || DEFAULT_HEIGHT,
      html: [],
      css: []
      // jsx: [],
    };

    this.sniffConfig = {
      whitelist: this.props.whitelist,
      blacklist: this.props.blacklist
    };

    this.updateHTML = this.updateHTML.bind(this);
    this.updateCSS = this.updateCSS.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    // this.updateJSX = this.updateJSX.bind(this);
    // this.updateJSXChildren = this.updateJSXChildren.bind(this);
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
    if (!child) {
      return;
    } else if (typeof child === "string") {
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
    const rules = CSSSniff.getCSSRules(
      [...this.container.childNodes],
      this.sniffConfig
    );
    const rawCSS = CSSSniff.serialize(rules);
    const css = CSSBeautify(rawCSS, {
      output: CSS_OUTPUT_FORMATS.html
    });
    this.setState({ css });
  }

  addToCart() {
    this.containerSentToCart = this.container;
    if (!this.containerSentToCart) return;
    window[GLOBAL_NAMESPACE].add(
      this.containerSentToCart,
      this.props.filename,
      this.sniffConfig
    );
    this.setState({
      inCart: true
    });
  }

  removeFromCart(containerSentToCart) {
    const cartContainer = containerSentToCart || this.container;
    if (!cartContainer) return;
    window[GLOBAL_NAMESPACE].remove(cartContainer);
    this.setState({
      inCart: false
    });
  }

  render() {
    const { renderChildren, children, renderHTML, renderCSS } = this.props;
    const { visible, height, html, jsx, css, inCart } = this.state;

    if (!visible) return <div style={{ height }} />;

    const kids = (
      <div
        ref={container => {
          if (this.containerSentToCart) {
            this.removeFromCart(this.containerSentToCart);
          }
          this.container = container;
          if (inCart) {
            this.addToCart();
          }
        }}
        onClick={this.updateBook}
        className="pattern-book__example"
      >
        {children}
      </div>
    );

    return (
      <div className="b-container">
        <button
          title={inCart ? "Remove from cart" : "Add to cart"}
          onClick={inCart ? this.removeFromCart : this.addToCart}
          className={`b-cart-toggle b-cart-toggle--${
            inCart ? "in-cart" : "not-in-cart"
          }`}
        >
          {inCart ? "- Remove from cart" : "+ Add to cart"}
        </button>
        {renderChildren ? renderChildren(kids) : kids}
        <details className="pattern-book__html" onClick={this.updateHTML}>
          <summary>
            <abbr title="hypertext markup language">HTML</abbr>
          </summary>
          {renderHTML ? (
            renderHTML(html)
          ) : (
            <code
              className="b-code"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </details>
        <details className="pattern-book__css" onClick={this.updateCSS}>
          <summary>
            <abbr title="Cascading Style Sheets">CSS</abbr>
          </summary>
          {renderCSS ? (
            renderCSS(css)
          ) : (
            <code
              className="b-code"
              dangerouslySetInnerHTML={{ __html: css }}
            />
          )}
        </details>
      </div>
    );
  }
}

class CSSSniff {
  static getCSSRules(children, options, matchedCSS) {
    return children.reduce((matchedCSS, child, i) => {
      matchedCSS = CSSSniff.getCSSRulesByElement(child, options, matchedCSS);
      if (child.childNodes)
        matchedCSS = CSSSniff.getCSSRules(
          [...child.childNodes],
          options,
          matchedCSS
        );
      return matchedCSS;
    }, matchedCSS || {});
  }

  static getCSSRulesByElement(el, options, matchedCSS) {
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
      const sheet = sheets[i];
      if (CSSSniff.sheetIsAllowed(sheet, options)) {
        const matchedCSSRule = CSSSniff._filterCSSRulesByElement(
          el,
          sheet.rules || sheet.cssRules,
          options,
          matchedCSS[i] || {}
        );
        if (matchedCSSRule) {
          matchedCSS[i] = matchedCSSRule;
        }
      }
    }
    return matchedCSS;
  }

  static _filterCSSRulesByElement(el, rules, options, matchedCSS) {
    for (let i in rules) {
      const rule = rules[i];
      if (rule.selectorText) {
        if (CSSSniff.ruleIsAllowed(rule.selectorText, options)) {
          // TODO split selectorText by separator
          // eg
          // selector = 'a,b'  -->  ['a','b']
          // BUT ALSO
          // selector = 'a[attr=','],b'  -->  'a[attr=\',\']', 'b']
          // Currently the splitting is naive
          const selectors = rule.selectorText.split(",");
          selectors.forEach(selector => {
            try {
              if (el.matches(selector)) {
                matchedCSS[i] = {
                  selectors: (matchedCSS[i] && matchedCSS[i].selectors) || [],
                  properties: rule.cssText.substring(rule.cssText.indexOf("{"))
                };
                if (matchedCSS[i].selectors.indexOf(selector) === -1) {
                  matchedCSS[i].selectors.push(selector);
                }
              }
            } catch (e) {
              console.error("ERROR", e.type);
            }
          });
        }
      } else if ((rule.rules || rule.cssRules) && rule.conditionText) {
        if (CSSSniff.mediaIsAllowed(rule.conditionText, options)) {
          // a nested rule like @media { rule { ... } }
          // so we filter the rules inside individually
          const nestedRules = CSSSniff._filterCSSRulesByElement(
            el,
            rule.rules || rule.cssRules,
            options,
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
    }
    return Object.keys(matchedCSS).length ? matchedCSS : undefined;
  }

  static sheetIsAllowed(sheet, options) {
    // Returns boolean of whether the sheet is allowed
    // due to whitelist/blacklist
    if (!options || !sheet) return false;

    // checking sheet.ownerNode because maybe window.document.styleSheets
    // can have non-ownerNode stylesheets (JS-created or something?)
    if (!sheet.ownerNode) return false;

    const checkStylesheet = (sheet, sheetMatch) => {
      switch (sheet.ownerNode.nodeName.toLowerCase()) {
        case "style":
        case "link":
          // matching on JSON.stringify(node.attrs)
          const nodeAttrs = sheet.ownerNode.attributes;
          const attrs = {};
          for (let i = 0; i < nodeAttrs.length; i++)
            attrs[nodeAttrs[i].name] = nodeAttrs[i].value;
          const attributesJSON = JSON.stringify(attrs);
          return attributesJSON.indexOf(sheetMatch) !== -1;
      }
    };

    let whitelisted, blacklisted;

    const whitelistStylesheets =
      options.whitelist && options.whitelist.stylesheet;
    if (whitelistStylesheets) {
      const sheetMatches = Array.isArray(whitelistStylesheets)
        ? whitelistStylesheets
        : [whitelistStylesheets];
      whitelisted = sheetMatches.some(sheetMatch =>
        checkStylesheet(sheet, sheetMatches)
      );
    }

    const blacklistStylesheets =
      options.blacklist && options.blacklist.stylesheet;
    if (blacklistStylesheets) {
      const sheetMatches = Array.isArray(blacklistStylesheets)
        ? blacklistStylesheets
        : [blacklistStylesheets];
      blacklisted = sheetMatches.some(sheetMatch =>
        checkStylesheet(sheet, sheetMatch)
      );
    }

    return whitelisted !== false && blacklisted !== true;
  }

  static mediaIsAllowed(mediaString, options) {
    if (!options || !mediaString) return false;

    let whitelisted, blacklisted;

    const whitelistMedia = options.whitelist && options.whitelist.media;
    if (whitelistMedia) {
      const mediaMatches = Array.isArray(whitelistMedia)
        ? whitelistMedia
        : [whitelistMedia];
      whitelisted = mediaMatches.some(
        mediaMatch => mediaString.indexOf(mediaMatch) !== -1
      );
    }

    const blacklistMedia = options.blacklist && options.blacklist.media;
    if (blacklistMedia) {
      const mediaMatches = Array.isArray(blacklistMedia)
        ? blacklistMedia
        : [blacklistMedia];
      blacklisted = mediaMatches.some(
        mediaMatch => mediaString.indexOf(mediaMatch) !== -1
      );
    }

    return whitelisted !== false && blacklisted !== true;
  }

  static ruleIsAllowed(ruleString, options) {
    if (!options || !ruleString) return false;

    let whitelisted, blacklisted;

    const whitelistRules = options.whitelist && options.whitelist.rule;
    if (whitelistRules) {
      const ruleMatches = Array.isArray(whitelistRules)
        ? whitelistRules
        : [whitelistRules];
      whitelisted = ruleMatches.some(
        ruleMatch => ruleString.indexOf(ruleMatch) !== -1
      );
    }

    const blacklistRules = options.blacklist && options.blacklist.rule;
    if (blacklistRules) {
      const ruleMatches = Array.isArray(blacklistRules)
        ? blacklistRules
        : [blacklistRules];
      blacklisted = ruleMatches.some(
        ruleMatch => ruleString.indexOf(ruleMatch) !== -1
      );
    }

    return whitelisted !== false && blacklisted !== true;
  }

  static deepMergeRules(rulesArray) {
    // Via https://stackoverflow.com/a/34749873
    /**
     * Simple object check.
     * @param item
     * @returns {boolean}
     */
    function isObject(item) {
      return item && typeof item === "object" && !Array.isArray(item);
    }

    /**
     * Deep merge two objects.
     * @param target
     * @param ...sources
     */
    function mergeDeep(target, ...sources) {
      if (!sources.length) return target;
      const source = sources.shift();

      if (isObject(target) && isObject(source)) {
        for (const key in source) {
          if (isObject(source[key])) {
            if (!target[key]) Object.assign(target, { [key]: {} });
            mergeDeep(target[key], source[key]);
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        }
      }

      return mergeDeep(target, ...sources);
    }

    return mergeDeep({}, ...rulesArray);
  }

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
}

class PatternBookCart {
  constructor(args) {
    this.args = args;
    this.cart = [];
    this.cartConfig = [];
    this.cartTitle = [];
    this.DOCTYPE = "<!DOCTYPE html>\n\n";

    // tedious binding...
    this.add = this.add.bind(this);
    this.initRoot = this.initRoot.bind(this);
    this.remove = this.remove.bind(this);
    this.render = this.render.bind(this);
    this.getCSS = this.getCSS.bind(this);
    this.getHTML = this.getHTML.bind(this);
    this.download = this.download.bind(this);

    this.initRoot();
  }

  initRoot() {
    this.root = document.createElement("div");
    this.root.className = "b-cart";
    this.root.innerHTML = `<h1 class="b-cart__title">Cart</h1><p><span data-count></span></p><button type="button" class="b-download">Download</button>`;
    this.root.count = this.root.querySelector("[data-count]");
    this.root.button = this.root.querySelector("button");
    this.root.button.addEventListener("click", this.download);
    document.body.appendChild(this.root);
  }

  add(element, title, config) {
    const index = this.cart.indexOf(element);
    if (index !== -1) return; // ensure elements are only added once
    this.cart.push(element);
    this.cartTitle.push(title);
    this.cartConfig.push(config);
    this.render();
  }

  remove(element, whitelist, blacklist) {
    const index = this.cart.indexOf(element);
    if (index === -1) return;
    this.cart.splice(index, 1);
    this.cartTitle.splice(index, 1);
    this.cartConfig.splice(index, 1);
    this.render();
  }

  render() {
    if (this.cart.length === 0) {
      this.root.style.display = "none";
      return;
    }
    this.root.style.display = "block";
    this.root.count.textContent = `${this.cart.length} item${
      this.cart.length > 1 ? "s" : ""
    }`;
  }

  getCSS() {
    const rulesArray = this.cart.map((element, index) => {
      return CSSSniff.getCSSRules(
        [...element.childNodes],
        this.cartConfig[index]
      );
    });
    const mergedRules = CSSSniff.deepMergeRules(rulesArray);
    const rawCSS = CSSSniff.serialize(mergedRules);
    return rawCSS;
  }

  getHTML() {
    return this.cart.map((element, index) => {
      const title = this.cartTitle[index] || "pattern";
      return [title + "-" + index + ".html", this.DOCTYPE + element.innerHTML];
    });
  }

  download() {
    var zip = new JSZip();
    const rawCSS = this.getCSS();
    const css = CSSBeautify(rawCSS, {
      output: CSS_OUTPUT_FORMATS.plaintext
    });
    zip.file("patterns.css", css);
    const html = this.getHTML();
    var htmlDirectory = zip.folder("html");
    html.forEach(htmlPart => {
      htmlDirectory.file(htmlPart[0], htmlPart[1]);
    });

    zip.generateAsync({ type: "blob" }).then(function(content) {
      // see FileSaver.js
      saveAs(content, "your-patterns.zip");
    });
  }
}

if (!window[GLOBAL_NAMESPACE]) {
  // another PB has already registered
  window[GLOBAL_NAMESPACE] = new PatternBookCart({
    namespace: GLOBAL_NAMESPACE
  });
}
