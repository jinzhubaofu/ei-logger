/**
 * @file dispatcher spec
 * @author Leon(leon@outlook.com)
 */

/*eslint-env node*/

var u = require('underscore');
var dispatcher = require('../lib/dispatcher');

describe('dispatcher', function () {

    it('有addListener方法', function () {
        expect(u.isFunction(dispatcher.addListener)).toBe(true);
    });

    it('有addListener方法', function () {
        expect(u.isFunction(dispatcher.addListener)).toBe(true);
    });

    it('有removeListener方法', function () {
        expect(u.isFunction(dispatcher.removeListener)).toBe(true);
    });

    it('执行dispatch会触listener', function () {

        var spy = jasmine.createSpy();

        dispatcher.addListener(spy);

        dispatcher.dispatch('debug', 'aaa');

        expect(spy).toHaveBeenCalledWith('debug', 'aaa');

        dispatcher.removeListener(spy);

        dispatcher.dispatch('info', 'bbb');

        expect(spy).not.toHaveBeenCalledWith('info', 'bbb');

    });

});
