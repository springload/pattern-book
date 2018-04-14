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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_HEIGHT = 100;

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

    _this.updateHTML = _this.updateHTML.bind(_this);
    _this.updateCSS = _this.updateCSS.bind(_this);
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
      if (!child) return;else if (typeof child === "string") {
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
      var rules = CSSSniff.getCSSRules([].concat(_toConsumableArray(this.container.childNodes)), {
        whitelist: this.props.whitelist,
        blacklist: this.props.blacklist
      });
      var rawCSS = CSSSniff.serialize(rules);
      var css = (0, _cssZeroBeautify2.default)(rawCSS, {
        output: _cssZeroBeautify.OUTPUT_FORMATS.html
      });
      this.setState({ css: css });
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
          css = _state.css;


      if (!visible) return _react2.default.createElement("div", { style: { height: height } });

      var kids = _react2.default.createElement(
        "div",
        {
          ref: function ref(container) {
            _this2.container = container;
          },
          onClick: this.updateBook,
          className: "pattern-book__example"
        },
        children
      );

      return _react2.default.createElement(
        "div",
        { className: "pattern-book" },
        renderChildren ? renderChildren(kids) : kids,
        _react2.default.createElement(
          "details",
          { className: "pattern-book__html", onClick: this.updateHTML },
          _react2.default.createElement(
            "summary",
            null,
            "HTML"
          ),
          renderHTML ? renderHTML(html) : _react2.default.createElement("code", { dangerouslySetInnerHTML: { __html: html } })
        ),
        _react2.default.createElement(
          "details",
          { className: "pattern-book__css", onClick: this.updateCSS },
          _react2.default.createElement(
            "summary",
            null,
            "CSS"
          ),
          renderCSS ? renderCSS(css) : _react2.default.createElement("code", { dangerouslySetInnerHTML: { __html: css } })
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
