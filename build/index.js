"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _xmlZeroBeautify = require("xml-zero-beautify");

var _xmlZeroBeautify2 = _interopRequireDefault(_xmlZeroBeautify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      jsx: [],
      css: []
    };

    _this.updateBook = _this.updateBook.bind(_this);
    _this.updateHTML = _this.updateHTML.bind(_this);
    _this.updateJSX = _this.updateJSX.bind(_this);
    _this.updateJSXChildren = _this.updateJSXChildren.bind(_this);
    _this.updateCSS = _this.updateCSS.bind(_this);
    _this.updateCSSChildren = _this.updateCSSChildren.bind(_this);
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
      this.updateJSX();
      this.updateCSS();
    }
  }, {
    key: "updateHTML",
    value: function updateHTML() {
      var html = (0, _xmlZeroBeautify2.default)(this.container.innerHTML, {
        html: true,
        output: _xmlZeroBeautify.OUTPUT_FORMATS.html
      });

      this.setState({
        html
      });
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
        jsx
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
        tag += ` ${key}=`;
        tag += typeof child.props[key] === "string" ? `"${child.props[key]}"` : `{${child.props[key]}}`;
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
      var childNodes = this.container.childNodes;
      var children = Array.prototype.slice.call(childNodes);

      var css = children.map(this.updateCSSChildren).join("");

      // TODO pretty format CSS
      this.setState({
        css
      });
    }
  }, {
    key: "updateCSSChildren",
    value: function updateCSSChildren(child) {
      if (!child.getAttribute) return; // probable text node
      var css = "";
      var style = child.getAttribute("style");
      if (style) {
        css += `/* inline style on '${child.name}' ${style} */\n`;
      }
      css += getCSS(child);
      if (child.childNodes) {
        var children = Array.prototype.slice.call(child.childNodes);
        css += children.map(this.updateCSSChildren).join("");
      }
      return css;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var children = this.props.children;
      var _state = this.state,
          visible = _state.visible,
          height = _state.height,
          html = _state.html,
          jsx = _state.jsx,
          css = _state.css;


      if (!visible) return _react2.default.createElement("div", { style: { height } });

      return _react2.default.createElement(
        "div",
        { className: "pattern-book" },
        _react2.default.createElement(
          "div",
          {
            ref: function ref(container) {
              _this2.container = container;
            },
            onClick: this.updateBook
          },
          children
        ),
        _react2.default.createElement(
          "details",
          { className: "pattern-book__html" },
          _react2.default.createElement(
            "summary",
            null,
            "HTML"
          ),
          _react2.default.createElement(
            "code",
            null,
            html
          ) || "(no HTML)"
        ),
        _react2.default.createElement(
          "details",
          { className: "pattern-book__css" },
          _react2.default.createElement(
            "summary",
            null,
            "CSS"
          ),
          _react2.default.createElement(
            "code",
            null,
            css
          ) || "(no css)"
        )
      );
    }
  }]);

  return PatternBook;
}(_react.PureComponent);

exports.default = PatternBook;


var getCSS = function getCSS(el) {
  var sheets = document.styleSheets,
      ret = [];
  el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;
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
