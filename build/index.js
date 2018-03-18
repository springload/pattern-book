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
      // jsx: [],
      css: []
    };

    _this.updateBook = _this.updateBook.bind(_this);
    _this.updateHTML = _this.updateHTML.bind(_this);
    // this.updateJSX = this.updateJSX.bind(this);
    // this.updateJSXChildren = this.updateJSXChildren.bind(this);
    _this.updateCSS = _this.updateCSS.bind(_this);
    return _this;
  }

  _createClass(PatternBook, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateBook();
    }
  }, {
    key: "updateBook",
    value: function updateBook() {
      this.updateHTML();
      this.updateCSS();
      // this.updateJSX();
    }
  }, {
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
      var rules = CSSSniff.getCSSRules([].concat(_toConsumableArray(this.container.childNodes)));
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
          { className: "pattern-book__html" },
          _react2.default.createElement(
            "summary",
            null,
            "HTML"
          ),
          renderHTML ? renderHTML(html) : _react2.default.createElement("code", { dangerouslySetInnerHTML: { __html: html } })
        ),
        _react2.default.createElement(
          "details",
          { className: "pattern-book__css" },
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
  }, {
    key: "getCSSRules",
    value: function getCSSRules(children, matchedCSS) {
      return children.reduce(function (matchedCSS, child, i) {
        matchedCSS = CSSSniff.getCSSRulesByElement(child, matchedCSS);
        if (child.childNodes) matchedCSS = CSSSniff.getCSSRules([].concat(_toConsumableArray(child.childNodes)), matchedCSS);
        return matchedCSS;
      }, matchedCSS || {});
    }
  }, {
    key: "getCSSRulesByElement",
    value: function getCSSRulesByElement(el, matchedCSS) {
      var matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;
      if (!matches) return matchedCSS; // presumed text node
      el.matches = matches;

      var sheets = window.document.styleSheets;
      for (var i in sheets) {
        var matchedCSSRule = CSSSniff._filterCSSRulesByElement(el, sheets[i].rules || sheets[i].cssRules, matchedCSS[i] || {});
        if (matchedCSSRule) {
          matchedCSS[i] = matchedCSSRule;
        }
      }
      return matchedCSS;
    }
  }, {
    key: "_filterCSSRulesByElement",
    value: function _filterCSSRulesByElement(el, rules, matchedCSS) {
      var _loop = function _loop(i) {
        var rule = rules[i];
        if (rule.selectorText) {
          // TODO split selectorText by separator
          // eg
          // selector = 'a,b'  -->  ['a','b']
          // BUT ALSO
          // selector = 'a[attr=','],b'  -->  'a[attr=\',\']', 'b']
          // Currently the splitting is naive
          var selectors = rule.selectorText.split(",");
          selectors.forEach(function (selector) {
            if (el.matches(selector)) {
              matchedCSS[i] = {
                selectors: matchedCSS[i] && matchedCSS[i].selectors || [],
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
          var nestedRules = CSSSniff._filterCSSRulesByElement(el, rule.rules || rule.cssRules, {});
          if (nestedRules) {
            matchedCSS[i] = {
              before: "@media " + rule.conditionText + " {",
              children: nestedRules,
              after: "}"
            };
          }
        }
      };

      for (var i in rules) {
        _loop(i);
      }
      return Object.keys(matchedCSS).length ? matchedCSS : undefined;
    }
  }]);

  return CSSSniff;
}();
