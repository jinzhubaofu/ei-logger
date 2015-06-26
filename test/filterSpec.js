/**
 * @file filter spec
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

var u = require('underscore');
var filter = require('../lib/filter');

describe('filter', function () {

    it('是一个函数', function () {
        expect(u.isFunction(filter)).toBe(true);
    });

    it('应该是对的', function () {
        expect(filter('debug', 'info')).toBe(false);
        expect(filter('info', 'info')).toBe(true);
        expect(filter('error', 'info')).toBe(true);
    });


});
