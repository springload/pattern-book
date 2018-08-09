"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _xmlZeroBeautify = require("xml-zero-beautify");

var _xmlZeroBeautify2 = _interopRequireDefault(_xmlZeroBeautify);

var _cssZeroBeautify = require("css-zero-beautify");

var _cssZeroBeautify2 = _interopRequireDefault(_cssZeroBeautify);

var _FileSaver = require("file-saver/FileSaver");

var _jszip = require("jszip");

var _jszip2 = _interopRequireDefault(_jszip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_HEIGHT = 100;
var GLOBAL_NAMESPACE = "__PATTERN_BOOK_CART__";

var PatternBook = function (_PureComponent) {
  _inherits(PatternBook, _PureComponent);

  function PatternBook(props) {
    _classCallCheck(this, PatternBook);

    var _this = _possibleConstructorReturn(this, (PatternBook.__proto__ || Object.getPrototypeOf(PatternBook)).call(this, props));

    _this.state = {
      visible: true,
      height: props.height || DEFAULT_HEIGHT,
      html: [],
      css: []
      // jsx: [],
    };

    _this.sniffConfig = {
      whitelist: _this.props.whitelist,
      blacklist: _this.props.blacklist
    };

    _this.updateHTML = _this.updateHTML.bind(_this);
    _this.updateCSS = _this.updateCSS.bind(_this);
    _this.addToCart = _this.addToCart.bind(_this);
    _this.removeFromCart = _this.removeFromCart.bind(_this);
    // this.updateJSX = this.updateJSX.bind(this);
    // this.updateJSXChildren = this.updateJSXChildren.bind(this);
    return _this;
  }

  _createClass(PatternBook, [{
    key: "updateHTML",
    value: function updateHTML() {
      var html = (0, _xmlZeroBeautify2.default)(this.container.innerHTML, {
        html: true,
        output: _xmlZeroBeautify.OUTPUT_FORMATS.html
      });

      this.setState({ html: html });
    }
  }, {
    key: "updateJSX",
    value: function updateJSX() {
      var children = this.props.children;

      var jsx = _react2.default.Children.map(children, this.updateJSXChildren).join("");

      jsx = (0, _xmlZeroBeautify2.default)(this.container.innerHTML, {
        html: true,
        output: _xmlZeroBeautify.OUTPUT_FORMATS.html
      });

      this.setState({
        jsx: jsx
      });
    }
  }, {
    key: "updateJSXChildren",
    value: function updateJSXChildren(child) {
      if (!child) {
        return;
      } else if (typeof child === "string") {
        return child;
      }

      var tag = "<";
      var tagName = typeof child.type === "string" ? child.type : child.type.name;
      tag += tagName;

      Object.keys(child.props).filter(function (key) {
        return key !== "children";
      }).forEach(function (key) {
        tag += " " + key + "=";
        tag += typeof child.props[key] === "string" ? "\"" + child.props[key] + "\"" : "{" + child.props[key] + "}";
      });

      if (child.props.children) {
        tag += ">";
        tag += _react2.default.Children.map(child.props.children, this.updateJSXChildren).join("");
        tag += "</";
        tag += tagName;
        tag += ">";
      } else {
        tag += "/>";
      }
      return tag;
    }
  }, {
    key: "updateCSS",
    value: function updateCSS() {
      var rules = CSSSniff.getCSSRules([].concat(_toConsumableArray(this.container.childNodes)), this.sniffConfig);
      var rawCSS = CSSSniff.serialize(rules);
      var css = (0, _cssZeroBeautify2.default)(rawCSS, {
        output: _cssZeroBeautify.OUTPUT_FORMATS.html
      });
      this.setState({ css: css });
    }
  }, {
    key: "addToCart",
    value: function addToCart() {
      this.containerSentToCart = this.container;
      if (!this.containerSentToCart) return;
      window[GLOBAL_NAMESPACE].add(this.containerSentToCart, this.props.filename, this.sniffConfig);
      this.setState({
        inCart: true
      });
    }
  }, {
    key: "removeFromCart",
    value: function removeFromCart(containerSentToCart) {
      var cartContainer = containerSentToCart || this.container;
      if (!cartContainer) return;
      window[GLOBAL_NAMESPACE].remove(cartContainer);
      this.setState({
        inCart: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          renderChildren = _props.renderChildren,
          children = _props.children,
          renderHTML = _props.renderHTML,
          renderCSS = _props.renderCSS;
      var _state = this.state,
          visible = _state.visible,
          height = _state.height,
          html = _state.html,
          jsx = _state.jsx,
          css = _state.css,
          inCart = _state.inCart;


      if (!visible) return _react2.default.createElement("div", { style: { height: height } });

      var kids = _react2.default.createElement(
        "div",
        {
          ref: function ref(container) {
            if (_this2.containerSentToCart) {
              _this2.removeFromCart(_this2.containerSentToCart);
            }
            _this2.container = container;
            if (inCart) {
              _this2.addToCart();
            }
          },
          onClick: this.updateBook,
          className: "pattern-book__example"
        },
        children
      );

      return _react2.default.createElement(
        "div",
        { className: "b-container" },
        _react2.default.createElement(
          "button",
          {
            title: inCart ? "Remove from cart" : "Add to cart",
            onClick: inCart ? this.removeFromCart : this.addToCart,
            className: "b-cart-toggle b-cart-toggle--" + (inCart ? "in-cart" : "not-in-cart")
          },
          inCart ? "- Remove from cart" : "+ Add to cart"
        ),
        renderChildren ? renderChildren(kids) : kids,
        _react2.default.createElement(
          "details",
          { className: "pattern-book__html", onClick: this.updateHTML },
          _react2.default.createElement(
            "summary",
            null,
            _react2.default.createElement(
              "abbr",
              { title: "hypertext markup language" },
              "HTML"
            )
          ),
          renderHTML ? renderHTML(html) : _react2.default.createElement("code", {
            className: "b-code",
            dangerouslySetInnerHTML: { __html: html }
          })
        ),
        _react2.default.createElement(
          "details",
          { className: "pattern-book__css", onClick: this.updateCSS },
          _react2.default.createElement(
            "summary",
            null,
            _react2.default.createElement(
              "abbr",
              { title: "Cascading Style Sheets" },
              "CSS"
            )
          ),
          renderCSS ? renderCSS(css) : _react2.default.createElement("code", {
            className: "b-code",
            dangerouslySetInnerHTML: { __html: css }
          })
        )
      );
    }
  }]);

  return PatternBook;
}(_react.PureComponent);

exports.default = PatternBook;

var CSSSniff = function () {
  function CSSSniff() {
    _classCallCheck(this, CSSSniff);
  }

  _createClass(CSSSniff, null, [{
    key: "getCSSRules",
    value: function getCSSRules(children, options, matchedCSS) {
      return children.reduce(function (matchedCSS, child, i) {
        matchedCSS = CSSSniff.getCSSRulesByElement(child, options, matchedCSS);
        if (child.childNodes) matchedCSS = CSSSniff.getCSSRules([].concat(_toConsumableArray(child.childNodes)), options, matchedCSS);
        return matchedCSS;
      }, matchedCSS || {});
    }
  }, {
    key: "getCSSRulesByElement",
    value: function getCSSRulesByElement(el, options, matchedCSS) {
      var matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;
      if (!matches) return matchedCSS; // presumed text node
      el.matches = matches;

      var sheets = window.document.styleSheets;

      for (var i in sheets) {
        var sheet = sheets[i];
        if (CSSSniff.sheetIsAllowed(sheet, options)) {
          var matchedCSSRule = CSSSniff._filterCSSRulesByElement(el, sheet.rules || sheet.cssRules, options, matchedCSS[i] || {});
          if (matchedCSSRule) {
            matchedCSS[i] = matchedCSSRule;
          }
        }
      }
      return matchedCSS;
    }
  }, {
    key: "_filterCSSRulesByElement",
    value: function _filterCSSRulesByElement(el, rules, options, matchedCSS) {
      var _loop = function _loop(i) {
        var rule = rules[i];
        if (rule.selectorText) {
          if (CSSSniff.ruleIsAllowed(rule.selectorText, options)) {
            // TODO split selectorText by separator
            // eg
            // selector = 'a,b'  -->  ['a','b']
            // BUT ALSO
            // selector = 'a[attr=','],b'  -->  'a[attr=\',\']', 'b']
            // Currently the splitting is naive
            var selectors = rule.selectorText.split(",");
            selectors.forEach(function (selector) {
              try {
                if (el.matches(selector)) {
                  matchedCSS[i] = {
                    selectors: matchedCSS[i] && matchedCSS[i].selectors || [],
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
            var nestedRules = CSSSniff._filterCSSRulesByElement(el, rule.rules || rule.cssRules, options, {});
            if (nestedRules) {
              matchedCSS[i] = {
                before: "@media " + rule.conditionText + " {",
                children: nestedRules,
                after: "}"
              };
            }
          }
        }
      };

      for (var i in rules) {
        _loop(i);
      }
      return Object.keys(matchedCSS).length ? matchedCSS : undefined;
    }
  }, {
    key: "sheetIsAllowed",
    value: function sheetIsAllowed(sheet, options) {
      // Returns boolean of whether the sheet is allowed
      // due to whitelist/blacklist
      if (!options || !sheet) return false;

      // checking sheet.ownerNode because maybe window.document.styleSheets
      // can have non-ownerNode stylesheets (JS-created or something?)
      if (!sheet.ownerNode) return false;

      var checkStylesheet = function checkStylesheet(sheet, sheetMatch) {
        switch (sheet.ownerNode.nodeName.toLowerCase()) {
          case "style":
          case "link":
            // matching on JSON.stringify(node.attrs)
            var nodeAttrs = sheet.ownerNode.attributes;
            var attrs = {};
            for (var i = 0; i < nodeAttrs.length; i++) {
              attrs[nodeAttrs[i].name] = nodeAttrs[i].value;
            }var attributesJSON = JSON.stringify(attrs);
            return attributesJSON.indexOf(sheetMatch) !== -1;
        }
      };

      var whitelisted = void 0,
          blacklisted = void 0;

      var whitelistStylesheets = options.whitelist && options.whitelist.stylesheet;
      if (whitelistStylesheets) {
        var sheetMatches = Array.isArray(whitelistStylesheets) ? whitelistStylesheets : [whitelistStylesheets];
        whitelisted = sheetMatches.some(function (sheetMatch) {
          return checkStylesheet(sheet, sheetMatches);
        });
      }

      var blacklistStylesheets = options.blacklist && options.blacklist.stylesheet;
      if (blacklistStylesheets) {
        var _sheetMatches = Array.isArray(blacklistStylesheets) ? blacklistStylesheets : [blacklistStylesheets];
        blacklisted = _sheetMatches.some(function (sheetMatch) {
          return checkStylesheet(sheet, sheetMatch);
        });
      }

      return whitelisted !== false && blacklisted !== true;
    }
  }, {
    key: "mediaIsAllowed",
    value: function mediaIsAllowed(mediaString, options) {
      if (!options || !mediaString) return false;

      var whitelisted = void 0,
          blacklisted = void 0;

      var whitelistMedia = options.whitelist && options.whitelist.media;
      if (whitelistMedia) {
        var mediaMatches = Array.isArray(whitelistMedia) ? whitelistMedia : [whitelistMedia];
        whitelisted = mediaMatches.some(function (mediaMatch) {
          return mediaString.indexOf(mediaMatch) !== -1;
        });
      }

      var blacklistMedia = options.blacklist && options.blacklist.media;
      if (blacklistMedia) {
        var _mediaMatches = Array.isArray(blacklistMedia) ? blacklistMedia : [blacklistMedia];
        blacklisted = _mediaMatches.some(function (mediaMatch) {
          return mediaString.indexOf(mediaMatch) !== -1;
        });
      }

      return whitelisted !== false && blacklisted !== true;
    }
  }, {
    key: "ruleIsAllowed",
    value: function ruleIsAllowed(ruleString, options) {
      if (!options || !ruleString) return false;

      var whitelisted = void 0,
          blacklisted = void 0;

      var whitelistRules = options.whitelist && options.whitelist.rule;
      if (whitelistRules) {
        var ruleMatches = Array.isArray(whitelistRules) ? whitelistRules : [whitelistRules];
        whitelisted = ruleMatches.some(function (ruleMatch) {
          return ruleString.indexOf(ruleMatch) !== -1;
        });
      }

      var blacklistRules = options.blacklist && options.blacklist.rule;
      if (blacklistRules) {
        var _ruleMatches = Array.isArray(blacklistRules) ? blacklistRules : [blacklistRules];
        blacklisted = _ruleMatches.some(function (ruleMatch) {
          return ruleString.indexOf(ruleMatch) !== -1;
        });
      }

      return whitelisted !== false && blacklisted !== true;
    }
  }, {
    key: "deepMergeRules",
    value: function deepMergeRules(rulesArray) {
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
      function mergeDeep(target) {
        for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          sources[_key - 1] = arguments[_key];
        }

        if (!sources.length) return target;
        var source = sources.shift();

        if (isObject(target) && isObject(source)) {
          for (var key in source) {
            if (isObject(source[key])) {
              if (!target[key]) Object.assign(target, _defineProperty({}, key, {}));
              mergeDeep(target[key], source[key]);
            } else {
              Object.assign(target, _defineProperty({}, key, source[key]));
            }
          }
        }

        return mergeDeep.apply(undefined, [target].concat(sources));
      }

      return mergeDeep.apply(undefined, [{}].concat(_toConsumableArray(rulesArray)));
    }
  }, {
    key: "serialize",
    value: function serialize(rules) {
      if (!rules) return "";
      return Object.keys(rules).map(function (key) {
        var rule = rules[key];
        var css = "";
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
      }).join("");
    }
  }]);

  return CSSSniff;
}();

var PatternBookCart = function () {
  function PatternBookCart(args) {
    _classCallCheck(this, PatternBookCart);

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

  _createClass(PatternBookCart, [{
    key: "initRoot",
    value: function initRoot() {
      this.root = document.createElement("div");
      this.root.className = "b-cart";
      this.root.innerHTML = "<h1 class=\"b-cart__title\">Cart</h1><p><span data-count></span></p><button type=\"button\" class=\"b-download\">Download</button>";
      this.root.count = this.root.querySelector("[data-count]");
      this.root.button = this.root.querySelector("button");
      this.root.button.addEventListener("click", this.download);
      document.body.appendChild(this.root);
    }
  }, {
    key: "add",
    value: function add(element, title, config) {
      var index = this.cart.indexOf(element);
      if (index !== -1) return; // ensure elements are only added once
      this.cart.push(element);
      this.cartTitle.push(title);
      this.cartConfig.push(config);
      this.render();
    }
  }, {
    key: "remove",
    value: function remove(element, whitelist, blacklist) {
      var index = this.cart.indexOf(element);
      if (index === -1) return;
      this.cart.splice(index, 1);
      this.cartTitle.splice(index, 1);
      this.cartConfig.splice(index, 1);
      this.render();
    }
  }, {
    key: "render",
    value: function render() {
      if (this.cart.length === 0) {
        this.root.style.display = "none";
        return;
      }
      this.root.style.display = "block";
      this.root.count.textContent = this.cart.length + " item" + (this.cart.length > 1 ? "s" : "");
    }
  }, {
    key: "getCSS",
    value: function getCSS() {
      var _this3 = this;

      var rulesArray = this.cart.map(function (element, index) {
        return CSSSniff.getCSSRules([].concat(_toConsumableArray(element.childNodes)), _this3.cartConfig[index]);
      });
      var mergedRules = CSSSniff.deepMergeRules(rulesArray);
      var rawCSS = CSSSniff.serialize(mergedRules);
      return rawCSS;
    }
  }, {
    key: "getHTML",
    value: function getHTML() {
      var _this4 = this;

      return this.cart.map(function (element, index) {
        var title = _this4.cartTitle[index] || "pattern";
        return [title + "-" + index + ".html", _this4.DOCTYPE + element.innerHTML];
      });
    }
  }, {
    key: "download",
    value: function download() {
      var zip = new _jszip2.default();
      var rawCSS = this.getCSS();
      var css = (0, _cssZeroBeautify2.default)(rawCSS, {
        output: _cssZeroBeautify.OUTPUT_FORMATS.plaintext
      });
      zip.file("patterns.css", css);
      var html = this.getHTML();
      var htmlDirectory = zip.folder("html");
      html.forEach(function (htmlPart) {
        htmlDirectory.file(htmlPart[0], htmlPart[1]);
      });

      zip.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        (0, _FileSaver.saveAs)(content, "your-patterns.zip");
      });
    }
  }]);

  return PatternBookCart;
}();

if (!window[GLOBAL_NAMESPACE]) {
  // another PB has already registered
  window[GLOBAL_NAMESPACE] = new PatternBookCart({
    namespace: GLOBAL_NAMESPACE
  });
}
