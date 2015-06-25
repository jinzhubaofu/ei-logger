/**
 * @file 判断是否符合level限制
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

var LEVELS = require('./conf/level').levels;

module.exports = function (levelName1, levelName2) {
    var levelValue1 = LEVELS[levelName1];
    var levelValue2 = LEVELS[levelName2];
    return levelValue1 >= levelValue2;
};
