/**
 * @file 判断是否符合level限制
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

var LEVELS = require('./conf/level').levels;

module.exports = function (loggerLevel, transportLevel) {
    return LEVELS[loggerLevel] >= LEVELS[transportLevel];
};
