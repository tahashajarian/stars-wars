"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fire = _interopRequireDefault(require("../sounds/fire.mp3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SoundManager =
/*#__PURE__*/
function () {
  function SoundManager() {
    _classCallCheck(this, SoundManager);
  }

  _createClass(SoundManager, [{
    key: "fire",
    value: function fire() {
      this.fireSound = new Audio(_fire["default"]);
      this.fireSound.play();
    }
  }]);

  return SoundManager;
}();

exports["default"] = SoundManager;