'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Bot = require('./Bot');

var _Bot2 = _interopRequireDefault(_Bot);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _Bot2.default(_fs2.default.readFileSync('token.txt').toString().trim());
//# sourceMappingURL=run.js.map